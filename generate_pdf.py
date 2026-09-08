import os, subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>RevenueRecover AI — Founder Master Execution Worksheet & Production Links</title>
<style>
  @page {
    size: A4;
    margin: 12mm 12mm 12mm 12mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background: #ffffff;
    line-height: 1.45;
    font-size: 10pt;
  }
  .header {
    border-bottom: 3px solid #10b981;
    padding-bottom: 10px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    font-size: 18pt;
    font-weight: 900;
    color: #090d16;
    letter-spacing: -0.5px;
  }
  .header h1 span { color: #10b981; }
  .header .badge {
    background: #0f172a;
    color: #ffffff;
    font-size: 8pt;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: uppercase;
  }
  h2 {
    font-size: 11.5pt;
    font-weight: 800;
    color: #0f172a;
    margin: 14px 0 6px 0;
    border-left: 4px solid #10b981;
    padding-left: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1e293b;
    margin: 8px 0 4px 0;
  }
  p, li {
    font-size: 9pt;
    color: #334155;
    margin-bottom: 4px;
  }
  ul, ol {
    margin-left: 18px;
    margin-bottom: 6px;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 8px 0;
  }
  .card {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 10px;
    background: #f8fafc;
  }
  .card.highlight {
    border-color: #10b981;
    background: #f0fdf4;
  }
  .plan-title {
    font-size: 10pt;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 2px;
  }
  .price {
    font-size: 14pt;
    font-weight: 900;
    color: #059669;
    font-family: monospace;
  }
  .link-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 4px 6px;
    font-family: monospace;
    font-size: 7.5pt;
    word-break: break-all;
    color: #0369a1;
    margin: 4px 0;
  }
  .step-box {
    background: #ffffff;
    border-left: 3px solid #0284c7;
    border-top: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 0 6px 6px 0;
    padding: 8px 10px;
    margin-bottom: 8px;
  }
  .step-num {
    font-size: 8.5pt;
    font-weight: 800;
    color: #0284c7;
    text-transform: uppercase;
  }
  .marathi-explain {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 10px;
    margin: 8px 0;
    font-size: 8.8pt;
  }
  .template-box {
    background: #0f172a;
    color: #f1f5f9;
    border-radius: 6px;
    padding: 8px 10px;
    font-family: monospace;
    font-size: 7.5pt;
    line-height: 1.35;
    white-space: pre-wrap;
    margin: 6px 0;
  }
  .check-item {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 8.5pt;
    margin-bottom: 4px;
  }
  .check-square {
    width: 10px;
    height: 10px;
    border: 1.5px solid #64748b;
    border-radius: 2px;
    margin-top: 2px;
    flex-shrink: 0;
  }
  .table-links {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 8.5pt;
  }
  .table-links th, .table-links td {
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    text-align: left;
  }
  .table-links th {
    background: #0f172a;
    color: white;
    font-weight: 800;
  }
  .table-links td {
    background: #ffffff;
  }
  .page-break {
    page-break-before: always;
  }
  .footer-note {
    margin-top: 14px;
    border-top: 1px solid #e2e8f0;
    padding-top: 6px;
    font-size: 7.5pt;
    color: #94a3b8;
    text-align: center;
  }
</style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="header">
    <div>
      <h1>RevenueRecover <span>AI</span></h1>
      <p style="font-size: 8.5pt; color: #64748b; font-weight: 700;">Founder Master Execution Worksheet & Production Links</p>
    </div>
    <div class="badge">CONFIDENTIAL • FOUNDER SOP</div>
  </div>

  <h2>1. Official Production Links (आपल्या सर्व अधिकृत लिंक्स)</h2>
  <table class="table-links">
    <tr>
      <th style="width: 30%;">प्लॅटफॉर्म नाव (Platform)</th>
      <th style="width: 45%;">अधिकृत लिंक (Live URL)</th>
      <th style="width: 25%;">वापर (Purpose)</th>
    </tr>
    <tr>
      <td><strong>Official Web Store</strong></td>
      <td style="font-family: monospace; color: #0284c7;">https://revenuerecover-ai.vercel.app/store</td>
      <td>ग्राहकाला पाठवण्यासाठी मुख्य स्टोअर</td>
    </tr>
    <tr>
      <td><strong>Shopify Online Store</strong></td>
      <td style="font-family: monospace; color: #0284c7;">https://0u14pb-fd.myshopify.com</td>
      <td>अधिकृत Shopify ई-कॉमर्स स्टोअर</td>
    </tr>
    <tr>
      <td><strong>Web Platform Main</strong></td>
      <td style="font-family: monospace; color: #0284c7;">https://revenuerecover-ai.vercel.app</td>
      <td>मुख्य SaaS वेब ॲप्लिकेशन होमपेज</td>
    </tr>
    <tr>
      <td><strong>Pitch Deck & Docs</strong></td>
      <td style="font-family: monospace; color: #0284c7;">https://revenuerecover-ai.vercel.app/docs</td>
      <td>कमर्शिअल प्रपोजल व डॉक्युमेंटेशन</td>
    </tr>
    <tr>
      <td><strong>Plan A ($119/mo) PayPal</strong></td>
      <td style="font-family: monospace; color: #059669;">https://www.paypal.com/ncp/payment/GFXAWMG4S227E</td>
      <td>मंथली ग्रोथ सबस्क्रिप्शन पेमेंट लिंक</td>
    </tr>
    <tr>
      <td><strong>Plan B ($990/yr) PayPal</strong></td>
      <td style="font-family: monospace; color: #059669;">https://www.paypal.com/ncp/payment/ZKXHXXNDN4D7J</td>
      <td>ॲन्युअल व्हीआयपी लायसन्स पेमेंट लिंक</td>
    </tr>
  </table>

  <h2>2. २ मुख्य प्लॅन्स आणि त्यांचे तपशील (Commercial Packages)</h2>
  <div class="grid-2">
    <div class="card">
      <div class="plan-title">PLAN A: Monthly Growth Plan</div>
      <div class="price">$119.00 USD / Month</div>
      <div class="link-box">https://www.paypal.com/ncp/payment/GFXAWMG4S227E</div>
      <ul style="margin-top: 4px; font-size: 8pt;">
        <li><strong>१५०-२०० Local Trade Leads</strong> पहिल्याच दिवशी CSV मध्ये.</li>
        <li><strong>४५-सेकंद AI Auto Text-Back:</strong> मिस्ड कॉल येताच त्वरित SMS.</li>
        <li><strong>१ Call-Forwarding Number:</strong> व्यवसायाचे कॉल्स रूट करण्यासाठी.</li>
        <li><strong>CRM Sync:</strong> ServiceTitan, Jobber आणि Google Calendar.</li>
      </ul>
    </div>

    <div class="card highlight">
      <div class="plan-title">PLAN B: Annual VIP Commercial License</div>
      <div class="price">$990.00 USD / Year</div>
      <div class="link-box">https://www.paypal.com/ncp/payment/ZKXHXXNDN4D7J</div>
      <ul style="margin-top: 4px; font-size: 8pt;">
        <li><strong>५००+ Verified Trade Leads</strong> Day 1 डिलिव्हरी.</li>
        <li><strong>Unlimited Recoveries:</strong> मल्टि-व्हॅन व मल्टि-लोकेशनसाठी.</li>
        <li><strong>Dedicated VIP Onboarding:</strong> १-on-१ सेटअप.</li>
        <li><strong>Direct Founder VIP Support:</strong> प्रायोरिटी चॅनेल.</li>
      </ul>
    </div>
  </div>

  <h2>3. २०० लीड्स, Call-Forwarding व Auto SMS म्हणजे काय? (सोप्या भाषेत)</h2>
  <div class="marathi-explain">
    <p><strong>१. २०० लीड्स (200 Leads) म्हणजे काय आणि का पाठवायची?</strong><br>
    लीड म्हणजे अशा घरमालकांचे नाव, फोन नंबर व पत्ता ज्यांना त्यांच्या घरात AC, प्लंबिंग किंवा छताचे काम करून हवे आहे. अमेरिकन कंत्राटदाराला गिऱ्हाईक हवे असतात. आपण त्याला पहिल्याच दिवशी २०० संभाव्य ग्राहकांची एक्सेल फाईल देतो, ज्यामुळे तो लगेच $119 भरून खरेदी करतो. ही लिस्ट आपल्या RevenueRecover AI डॅशबोर्डमध्ये तयार असते, तुम्हाला फक्त त्याच्या शहराची फाईल डाऊनलोड करून त्याला ईमेल करायची असते.</p>
    
    <p style="margin-top: 6px;"><strong>२. Call-Forwarding कसे काम करते?</strong><br>
    जेव्हा कंत्राटदार छतावर किंवा कामात व्यस्त असतो आणि फोन उचलू शकत नाही (Missed Call होतो), तेव्हा त्याच्या फोनमधील सेटिंगमुळे तो मिस्ड कॉल आपोआप आपल्या AI सिस्टीमकडे फॉरवर्ड होतो.</p>

    <p style="margin-top: 6px;"><strong>३. ४५-सेकंद ऑटो SMS म्हणजे काय?</strong><br>
    मिस्ड कॉल येताच, आपला AI कॉम्प्युटर बरोबर ४५ सेकंदांत त्या घरमालकाला मेसेज पाठवतो: <em>"Hi, we missed your call. We have a technician available in your area. Reply 1 to book emergency repair!"</em> हे वाचून घरमालक लगेच अपॉइंटमेंट बुक करतो!</p>
  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page-break"></div>

  <div class="header">
    <div>
      <h1>RevenueRecover <span>AI</span></h1>
      <p style="font-size: 8.5pt; color: #64748b; font-weight: 700;">Section 4: Daily Outreach & Post-Payment Client Delivery</p>
    </div>
    <div class="badge">STANDARD OPERATING PROCEDURE</div>
  </div>

  <h2>4. Daily 60-Minute Outreach (शून्य खर्चात कंत्राटदार शोधणे)</h2>
  
  <div class="step-box">
    <div class="step-num">Step 1: Google Maps वरून २० कंत्राटदार शोधा (२० मिनिटे)</div>
    <p>Google Maps वर सर्च करा: <code>HVAC Dallas TX</code>, <code>Plumbers Houston TX</code>, <code>Roofing Phoenix AZ</code>. ४+ स्टार असलेल्या कंपन्यांचे नाव, मालकाचे नाव व ईमेल शोधा.</p>
  </div>

  <div class="step-box">
    <div class="step-num">Step 2: हा रेडीमेड मेसेज पाठवा (३० मिनिटे - Copy/Paste)</div>
    <div class="template-box">Subject: Quick question about missed calls for {Business Name}

Hi {Owner Name},

I saw your great reviews in {City}. 

When your technicians are busy on job sites or up on roofs, how many emergency $1,500 customer calls are slipping to competitors?

We built RevenueRecover AI — an autonomous system that texts back missed callers in 45 seconds to secure the job immediately. Plus, we dispatch 200 verified local homeowner leads in your ZIP codes on Day 1.

You can inspect the live system & activate your commercial license here:
👉 https://revenuerecover-ai.vercel.app/store

Best regards,
RevenueRecover AI Team</div>
  </div>

  <h2>5. PayPal वर पेमेंट आल्यावर ३० मिनिटांत काय करावे? (Client Delivery SOP)</h2>
  
  <div class="step-box">
    <div class="step-num">Action 1: ग्राहकाला Welcome & Intake Email पाठवा</div>
    <div class="template-box">Subject: Welcome to RevenueRecover AI — Account Activation & 200 Leads Intake

Hi {Customer Name},

Thank you for activating your RevenueRecover AI Commercial License!

To provision your 45-second auto text-back engine and dispatch your 200 verified local trade leads, please reply with:
1. Your Business Trade (HVAC, Plumbing, Roofing, Electrical)
2. Target Service City & ZIP Codes (e.g. Dallas, TX - 75001, 75002...)
3. Phone number to forward missed calls from

Our team will provision your AI routing and deliver your leads CSV within 12 hours.

Direct Founder WhatsApp / VIP Concierge: +91 8208057237
Portal URL: https://revenuerecover-ai.vercel.app

Best regards,
RevenueRecover AI Provisioning Team</div>
  </div>

  <div class="step-box">
    <div class="step-num">Action 2: ग्राहकाला सर्व्हिस डिलिव्हर करा (सर्व्हिस देणे)</div>
    <ul style="font-size: 8.5pt; margin-left: 16px;">
      <li><strong>२०० लीड्स फाईल:</strong> ग्राहकाच्या ZIP कोडनुसार २०० लीड्सची CSV/Excel फाईल ईमेलवर अटॅच करून पाठवा.</li>
      <li><strong>Call Forwarding चालू करणे:</strong> ग्राहकाला सांगा की त्याच्या फोनवरून <code>*71[AI_Number]</code> डायल करून मिस्ड कॉल्स AI वर फॉरवर्ड करावेत.</li>
      <li><strong>SMS Prompt सुरू करणे:</strong> त्याच्या बिझनेसच्या नावाने ४५-सेकंदांचा ऑटो मेसेज सिस्टीममध्ये सक्रिय करा.</li>
    </ul>
  </div>

  <h2>6. Daily Founder Accountability Checklist</h2>
  <div class="card">
    <div class="check-item"><div class="check-square"></div> <span><strong>09:00 AM:</strong> Checked PayPal account for new payments ($119 / $990).</span></div>
    <div class="check-item"><div class="check-square"></div> <span><strong>09:30 AM:</strong> Extracted 20 fresh contractor leads on Google Maps (Dallas, Phoenix, Houston).</span></div>
    <div class="check-item"><div class="check-square"></div> <span><strong>10:30 AM:</strong> Sent 20 personalized outreach emails with store link.</span></div>
    <div class="check-item"><div class="check-square"></div> <span><strong>02:00 PM:</strong> Followed up on inquiries via WhatsApp (+91 8208057237) & Email.</span></div>
    <div class="check-item"><div class="check-square"></div> <span><strong>05:00 PM:</strong> Dispatched lead packs and call-forwarding setup for paid subscribers.</span></div>
  </div>

  <div class="footer-note">
    RevenueRecover AI Ecosystem • Founder WhatsApp: +91 8208057237 • Web: https://revenuerecover-ai.vercel.app/store
  </div>

</body>
</html>"""

html_path = r"C:\Users\Lenovo\.gemini\antigravity\scratch\revenuerecover-ai-ecosystem\RevenueRecover_AI_Founder_Worksheet.html"
pdf_path = r"C:\Users\Lenovo\Desktop\RevenueRecover_AI_Founder_Worksheet.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_exe):
    edge_exe = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_path}",
    html_path
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Edge return code:", res.returncode)
print("PDF Exists on Desktop:", os.path.exists(pdf_path), "Size:", os.path.getsize(pdf_path) if os.path.exists(pdf_path) else 0)
