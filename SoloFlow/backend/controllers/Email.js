const easyinvoice = require('easyinvoice');
const { Resend } = require('resend');
const Invoice = require('../models/Invoice');

async function emailInvoice(req, res) {
  try{
    const {invoice_id}=req.params;
    if (!invoice_id) {
      return res.status(400).json({ message: "Invalid url" });
    }

    const invoice = await Invoice.findById(invoice_id).populate('invoice_client_id').populate('invoice_project_id').populate('particulars.task_id').populate('invoice_user_id');
    if (!invoice) {
      return res.status(404).json({ message: "Problem while fetching invoice details" });
    }


    const dateStr = invoice.invoice_date.toISOString().split('T')[0].replace(/-/g, '');
    const padNum = String(invoice.invoice_number).padStart(3, '0');
    const formattedInvoiceCode = `INV-${dateStr}-${padNum}`;

    const dueDate = new Date(invoice.invoice_date);
    dueDate.setDate(dueDate.getDate() + 14);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const data = {
      mode: "production",  
      images: {
          // Omit logo for clean, minimalist SaaS style
      },
      sender: {
          company: invoice.invoice_user_id.user_company,
          address: invoice.invoice_user_id.user_name,
          zip: "Email:",
          city: invoice.invoice_user_id.user_email,
          country: "India"
      },
      client: {
          company: invoice.invoice_client_id.client_company,
          address: `${invoice.invoice_client_id.client_name}, ${invoice.invoice_client_id.client_address}`,
          zip: "Email:",
          city: invoice.invoice_client_id.client_email,
          country: "India"
      },
      information: {
          number: formattedInvoiceCode,
          date: invoice.invoice_date.toISOString().split('T')[0],
          dueDate: dueDateStr
      },
      products: invoice.particulars.map(particular => ({
          quantity: 1,
          description: particular.task_name,
          price: particular.task_amount,
      })),
      bottomNotice: `Project: ${invoice.invoice_project_id.project_name}\nThank you for your business! Powered by SoloFlow.`,
      settings: {
          currency: "INR",
          locale: "en-IN",
          marginTop: 15,
          marginRight: 15,
          marginLeft: 15,
          marginBottom: 15
      },
      translate: {
          invoice: "INVOICE",
          number: "Invoice No",
          date: "Issue Date",
          dueDate: "Due Date",
          subtotal: "Subtotal",
          products: "Line Items Particulars",
          quantity: "Qty",
          price: "Price",
          productTotal: "Total",
          total: "Grand Total"
      }
    };

const result = await easyinvoice.createInvoice(data);

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  return res.status(500).json({ 
    message: "Resend API key is not configured in environment variables." 
  });
}

const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const clientEmail = invoice.invoice_client_id.client_email;

const emailPayload = {
  from: fromEmail,
  to: [clientEmail],
  subject: `Invoice #${invoice.invoice_number}`,
  text: `Dear ${invoice.invoice_client_id.client_name},\n\nPlease find attached the invoice #${invoice.invoice_number}.\n\nThank you!`,
  attachments: [
    {
      filename: `invoice_${invoice.invoice_number}.pdf`,
      content: result.pdf
    }
  ]
};

console.log("Sending invoice via Resend SDK...");

const resend = new Resend(resendApiKey);
const { data: resendData, error: resendError } = await resend.emails.send(emailPayload);

if (resendError) {
  console.error("Resend API error response:", resendError);
  return res.status(400).json({ 
    message: "Failed to send email via Resend API", 
    error: resendError.message 
  });
}

console.log("Email sent successfully via Resend SDK:", resendData);
res.status(200).json({ message: "Invoice sent successfully", info: resendData });

}catch (error) {
    console.error("Error sending invoice:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }}

module.exports = {
  emailInvoice
};