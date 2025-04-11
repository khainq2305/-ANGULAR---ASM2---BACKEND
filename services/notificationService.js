const nodemailer = require("nodemailer");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);

const sendEmail = async (
  to,
  subject,
  message,
  orderId = null,
  customerInfo = null,
  cartItems = [],
  totalAmount = null
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let itemsHtml = cartItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">
        ${item.quantity} x ${item.product?.name || "Không có tên"}
      </td>
      <td style="padding: 10px; border: 1px solid #ddd;">
        ${(item.product?.price ?? 0).toLocaleString("vi-VN")}₫
      </td>
    </tr>
  `
    )
    .join("");

  let emailMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #3498db; text-align: center;">🔑 Thông báo từ hệ thống</h2>
      <p>${message}</p>
      ${
        orderId && customerInfo
          ? `
      <p>Đơn hàng <strong>#${orderId}</strong> đã được xác nhận.</p>
      <p><strong>Người nhận:</strong> ${customerInfo.name}</p>
      <p><strong>Địa chỉ:</strong> ${customerInfo.address_detail}, ${
              customerInfo.ward
            }, ${customerInfo.district}, ${customerInfo.province}</p>
      <p><strong>Tổng tiền:</strong> <span style="color: #e74c3c; font-size: 18px;">${(
        totalAmount ?? 0
      ).toLocaleString("vi-VN")} VND</span></p>

      <h3>🛒 Chi tiết đơn hàng:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="background: #3498db; color: #fff; padding: 10px; border: 1px solid #ddd;">Sản phẩm</th>
          <th style="background: #3498db; color: #fff; padding: 10px; border: 1px solid #ddd;">Giá</th>
        </tr>
        ${itemsHtml}
      </table>
      `
          : ""
      }
      <p style="text-align: center; margin-top: 20px;">
        🚀 <strong>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</strong>
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: emailMessage,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email gửi thành công đến ${to}`);
  } catch (error) {
    console.error("❌ Lỗi khi gửi email:", error);
  }
};

// 📱 Hàm gửi SMS
const sendSMS = async (to, orderId, totalAmount) => {
  try {
    // Chuyển số VN về +84 nếu cần
    if (/^0\d{9}$/.test(to)) {
      to = `+84${to.substring(1)}`;
    }

    if (!/^\+\d{10,15}$/.test(to)) {
      console.error("❌ Số điện thoại không hợp lệ:", to);
      return;
    }

    const message = `
🛍️ Đơn hàng #${orderId} đã được xác nhận!
📦 Tổng tiền: ${totalAmount.toLocaleString("vi-VN")} VND
🚀 Cảm ơn bạn đã mua hàng!
    `;

    const response = await client.messages.create({
      body: message.trim(),
      from: twilioPhone,
      to,
    });

    console.log("✅ SMS đã gửi thành công!", response.sid);
  } catch (error) {
    console.error("❌ Lỗi khi gửi SMS:", error);
  }
};

module.exports = { sendEmail, sendSMS };
