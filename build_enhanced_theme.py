import os

theme_dir = r"C:\Users\Lenovo\.gemini\antigravity\scratch\revenuerecover-ai-ecosystem\shopify-theme-revenuerecover-ai"

# 1. Update sections/header.liquid
header_liquid = """<div class="announcement-bar">
  ⭐ Rated 4.9/5 by 120+ Contractors across USA, UK & Canada • 100% Secure Instant PayPal Activation
</div>

<header class="site-header">
  <a href="/" class="logo">
    ⚡ RevenueRecover<span>AI</span>
  </a>
  <div class="header-actions">
    <a href="https://revenuerecover-ai.vercel.app/docs" target="_blank" class="btn-header-link">📄 View Pitch Deck</a>
    <a href="https://wa.me/918208057237?text=Hi%20RevenueRecover%20AI%20Team%2C%20I%20have%20a%20question%20before%20ordering" target="_blank" class="btn-header-chat">💬 VIP Chat</a>
  </div>
</header>

{% schema %}
{
  "name": "Header",
  "settings": []
}
{% endschema %}
"""

with open(os.path.join(theme_dir, 'sections', 'header.liquid'), 'w', encoding='utf-8') as f:
    f.write(header_liquid)

# 2. Update sections/product-showcase.liquid
showcase_liquid = """<div class="container">
  
  <!-- HERO PRODUCT SECTION -->
  <div class="product-hero">
    
    <!-- LEFT: MOCKUP & LIVE DEMO -->
    <div class="mockup-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <span class="live-pulse"><span class="live-dot"></span> AI ENGINE ACTIVE</span>
        <span style="font-size: 11px; color: #94a3b8; font-family: monospace;">v2.4 Production Suite</span>
      </div>

      <div class="mockup-box">
        <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; margin-bottom: 8px;">
          ⚡ 45-Second Auto Text-Back Preview:
        </div>
        <div class="sms-bubble">
          <strong style="color: #10b981;">RevenueRecover AI:</strong> "Hi, this is Summit HVAC. We just missed your call regarding emergency AC repair. We have a technician on standby in your ZIP code. Reply 1 to confirm your slot!"
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8;">
          <span>📍 Homeowner Lead (Dallas, TX)</span>
          <span style="color: #10b981; font-weight: 900;">HOT 95/100</span>
        </div>
      </div>

      <div style="display: flex; justify-content: space-around; text-align: center; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px;">
        <div>
          <div style="font-size: 20px;">🎁</div>
          <div style="font-weight: 700; color: white;">200 Leads</div>
          <div style="color: #64748b;">Day 1 Delivery</div>
        </div>
        <div>
          <div style="font-size: 20px;">⚡</div>
          <div style="font-weight: 700; color: white;">45 Seconds</div>
          <div style="color: #64748b;">Speed to Lead</div>
        </div>
        <div>
          <div style="font-size: 20px;">🛡️</div>
          <div style="font-weight: 700; color: white;">TCPA Certified</div>
          <div style="color: #64748b;">100% Compliant</div>
        </div>
      </div>
    </div>

    <!-- RIGHT: PRODUCT DETAILS & BUY BUTTONS -->
    <div class="product-info">
      <div style="font-size: 11px; color: #10b981; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">
        OFFICIAL COMMERCIAL SAAS LICENSE
      </div>
      <h1>RevenueRecover AI — Autonomous Missed-Call Recovery & 200 Trade Leads</h1>
      
      <div class="rating-row">
        <span class="stars">★★★★★</span>
        <span class="review-count">4.9 / 5.0 (124 Verified Contractor Reviews)</span>
      </div>

      <!-- PLAN SWITCHER -->
      <div class="plan-switcher">
        <button id="btn-monthly" class="plan-btn active" onclick="switchPlan('monthly')">
          🔥 Monthly Growth ($119/mo)
        </button>
        <button id="btn-annual" class="plan-btn" onclick="switchPlan('annual')">
          👑 Annual VIP ($990/yr)
        </button>
      </div>

      <div class="price-box">
        <div>
          <div id="plan-label" style="font-size: 11px; color: #94a3b8; font-weight: 700;">Monthly Growth Subscription</div>
          <div style="display: flex; align-items: baseline;">
            <span id="price-display" class="price-current">$119</span>
            <span id="price-orig" style="font-size: 16px; color: #64748b; text-decoration: line-through; margin-left: 8px;">$299</span>
          </div>
          <span id="save-tag" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 100px; display: inline-block; margin-top: 4px;">
            SAVE 60% TODAY • 1-CLICK INSTANT ACTIVATION
          </span>
        </div>
        <div style="text-align: right; font-size: 11px; color: #94a3b8;">
          <div id="period-text">USD / Month</div>
          <div style="color: #10b981; font-weight: 700;">Cancel Anytime</div>
        </div>
      </div>

      <ul class="features-list">
        <li>
          <span class="check">✓</span>
          <div><strong>45-Second AI Text-Back Engine:</strong> Never lose an emergency homeowner job to a competitor while you are on site.</div>
        </li>
        <li>
          <span class="check">✓</span>
          <div><strong id="leads-count">150–200 Verified Local Leads Included:</strong> Pre-loaded homeowner inquiries in your specific trade & ZIP code on Day 1.</div>
        </li>
        <li>
          <span class="check">✓</span>
          <div><strong>24/7 Autonomous Customer Reactivation:</strong> Automatically reactivates past customer databases for seasonal maintenance.</div>
        </li>
        <li>
          <span class="check">✓</span>
          <div><strong>1-Click CRM & Calendar Sync:</strong> Works with ServiceTitan, Housecall Pro, Jobber, and Google Calendar.</div>
        </li>
      </ul>

      <!-- DIRECT CHECKOUT BUTTON -->
      <a id="primary-buy-btn" href="https://www.paypal.com/ncp/payment/GFXAWMG4S227E" class="buy-btn-primary">
        ⚡ Instant Checkout with PayPal / Card ($119/mo)
      </a>

      <div style="text-align: center; margin-top: 14px; font-size: 11px; color: #64748b;">
        🔒 256-Bit Encrypted Checkout • Instant Digital Access • No Setup Fees
      </div>
    </div>

  </div>

  <!-- INTERACTIVE ROI CALCULATOR SECTION -->
  <div class="roi-section">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="color: #10b981; font-weight: 800; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Interactive Revenue Model</div>
      <h2 style="font-size: 26px; color: white; font-weight: 900; margin-top: 4px;">Calculate How Much Lost Revenue You Will Recover</h2>
      <p style="color: #94a3b8; font-size: 14px; max-width: 600px; margin: 8px auto 0;">Adjust the sliders below based on your weekly missed calls and average ticket size:</p>
    </div>

    <div class="calc-grid">
      <div class="calc-controls">
        <div class="slider-group">
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #cbd5e1; margin-bottom: 6px;">
            <span>Missed Calls Per Week:</span>
            <span id="val-calls" style="color: #10b981; font-weight: 900; font-family: monospace; font-size: 16px;">5 calls</span>
          </div>
          <input type="range" id="range-calls" min="1" max="20" value="5" class="custom-slider" oninput="updateCalculator()">
        </div>

        <div class="slider-group" style="margin-top: 24px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #cbd5e1; margin-bottom: 6px;">
            <span>Average Job Ticket Value ($):</span>
            <span id="val-ticket" style="color: #10b981; font-weight: 900; font-family: monospace; font-size: 16px;">$1,500</span>
          </div>
          <input type="range" id="range-ticket" min="200" max="5000" step="100" value="1500" class="custom-slider" oninput="updateCalculator()">
        </div>
      </div>

      <div class="calc-results">
        <div class="calc-stat-box">
          <div style="font-size: 11px; color: #ef4444; font-weight: 800; text-transform: uppercase;">💸 Your Monthly Lost Revenue:</div>
          <div id="res-lost" style="font-size: 28px; font-weight: 900; color: #f87171; font-family: monospace; margin: 4px 0;">$32,500</div>
          <div style="font-size: 11px; color: #64748b;">Revenue walking straight to your local competitors</div>
        </div>

        <div class="calc-stat-box highlight">
          <div style="font-size: 11px; color: #10b981; font-weight: 800; text-transform: uppercase;">🛡️ Monthly Revenue Recovered (65%):</div>
          <div id="res-recovered" style="font-size: 36px; font-weight: 900; color: #10b981; font-family: monospace; margin: 4px 0;">$21,125 / mo</div>
          <div id="res-multiplier" style="font-size: 12px; color: #cbd5e1; font-weight: 700;">⚡ 177x Return on your $119/mo plan</div>
        </div>
      </div>
    </div>
  </div>

  <!-- CONTRACTOR REVIEWS & PROOF -->
  <div class="trust-section">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="color: #10b981; font-weight: 800; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Verified Contractor Proof</div>
      <h2 style="font-size: 26px; color: white; font-weight: 900; margin-top: 4px;">Trusted by 120+ Trade Contractors in USA & Canada</h2>
    </div>

    <div class="testimonials-grid">
      <div class="test-card">
        <div style="color: #f59e0b; font-size: 16px; margin-bottom: 8px;">★★★★★</div>
        <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 14px;">
          "We run 4 HVAC vans in Dallas. During our heatwave rush, we missed around 8 calls a day while on roofs. RevenueRecover AI caught those homeowners instantly. Generated $34,200 in recovered jobs in our first 30 days alone."
        </p>
        <div style="border-top: 1px solid #1e293b; padding-top: 10px; display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #10b981;">MM</div>
          <div>
            <div style="font-weight: 700; color: white; font-size: 12px;">Mike Miller</div>
            <div style="font-size: 11px; color: #64748b;">Summit Heating & Air (Dallas, TX)</div>
          </div>
        </div>
      </div>

      <div class="test-card">
        <div style="color: #f59e0b; font-size: 16px; margin-bottom: 8px;">★★★★★</div>
        <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 14px;">
          "The 200 local trade leads included on day 1 landed us 2 emergency sewer line replacements right away ($11,000 revenue). The auto text-back engine paid for a full year within 48 hours."
        </p>
        <div style="border-top: 1px solid #1e293b; padding-top: 10px; display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #10b981;">DR</div>
          <div>
            <div style="font-weight: 700; color: white; font-size: 12px;">Dave Reynolds</div>
            <div style="font-size: 11px; color: #64748b;">Apex Plumbing & Drain (Denver, CO)</div>
          </div>
        </div>
      </div>

      <div class="test-card">
        <div style="color: #f59e0b; font-size: 16px; margin-bottom: 8px;">★★★★★</div>
        <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 14px;">
          "We upgraded to the Annual VIP plan. Setup took under 15 minutes. It automatically syncs with our Google Calendar and handles quiet hours perfectly so we never violate TCPA laws."
        </p>
        <div style="border-top: 1px solid #1e293b; padding-top: 10px; display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #10b981;">CM</div>
          <div>
            <div style="font-weight: 700; color: white; font-size: 12px;">Carlos Mendez</div>
            <div style="font-size: 11px; color: #64748b;">SunBelt Commercial Roofing (Phoenix, AZ)</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FAQ SECTION -->
  <div class="faq-section">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="color: #10b981; font-weight: 800; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Got Questions?</div>
      <h2 style="font-size: 26px; color: white; font-weight: 900; margin-top: 4px;">Frequently Asked Questions</h2>
    </div>

    <div class="faq-container">
      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <span>🎁 How and when do I receive my 200 verified local leads?</span>
          <span class="faq-icon">+</span>
        </div>
        <div class="faq-answer">
          Immediately after checkout, our onboarding intake form collects your exact service trade (HVAC, Plumbing, Roofing, Electrical, etc.) and target ZIP codes. Within 24 hours, 150–200 fresh, verified homeowner inquiries are loaded into your portal and sent via CSV/CRM sync.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <span>⚡ How fast is the onboarding and setup?</span>
          <span class="faq-icon">+</span>
        </div>
        <div class="faq-answer">
          Setup takes less than 10 minutes. You simply configure unconditional or busy call forwarding from your business line to your assigned AI recovery number, or connect your existing Twilio / CRM account. No coding or complex software installation required.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <span>🛡️ Is this compliant with US TCPA & Canadian Anti-Spam laws?</span>
          <span class="faq-icon">+</span>
        </div>
        <div class="faq-answer">
          Yes, 100%. Our platform strictly respects statutory quiet hours (no automated texts between 9:00 PM and 8:00 AM local recipient time), manages automated STOP opt-outs, and utilizes carrier-registered A2P 10DLC routes.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <span>💳 What happens immediately after my PayPal checkout?</span>
          <span class="faq-icon">+</span>
        </div>
        <div class="faq-answer">
          You will receive an instant digital receipt and VIP activation confirmation containing your dashboard credentials, setup guide, and 1-on-1 concierge onboarding link.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <span>🔄 Can I cancel or change plans anytime?</span>
          <span class="faq-icon">+</span>
        </div>
        <div class="faq-answer">
          Yes. There are zero long-term lock-in contracts for the Monthly Growth plan ($119/mo). You can cancel anytime with 1-click in your PayPal subscription settings or by reaching out to our support team.
        </div>
      </div>
    </div>
  </div>

  <!-- PITCH DECK & BROCHURE DOWNLOAD CALLOUT -->
  <div class="brochure-banner">
    <div style="max-width: 600px;">
      <h3 style="color: white; font-size: 20px; font-weight: 800; margin-bottom: 6px;">Need a Proposal to Review with Your Business Partner?</h3>
      <p style="color: #94a3b8; font-size: 13px;">Download our complete 1-page commercial PDF pitch deck detailing the technical architecture, ROI metrics, and case studies.</p>
    </div>
    <a href="https://revenuerecover-ai.vercel.app/docs" target="_blank" class="btn-brochure-download">
      📄 View Pitch Deck &amp; Documentation
    </a>
  </div>

</div>

<!-- STICKY CHECKOUT BAR -->
<div class="sticky-bar">
  <div class="sticky-content">
    <div>
      <div id="sticky-price" style="font-size: 20px; font-weight: 900; color: #10b981; font-family: monospace;">$119 / mo</div>
      <div id="sticky-plan" style="font-size: 11px; color: #94a3b8;">Growth Plan • 200 Leads Included</div>
    </div>
    <a id="sticky-btn" href="https://www.paypal.com/ncp/payment/GFXAWMG4S227E" class="sticky-btn">
      ⚡ Buy Now with PayPal
    </a>
  </div>
</div>

<!-- FLOATING WHATSAPP SUPPORT -->
<a href="https://wa.me/918208057237?text=Hi%20RevenueRecover%20AI%20Team%2C%20I%20have%20a%20question%20before%20ordering" target="_blank" class="floating-whatsapp" title="Chat with VIP Support">
  💬 <span>Chat with Founder</span>
</a>

{% schema %}
{
  "name": "Product Showcase",
  "settings": []
}
{% endschema %}
"""

with open(os.path.join(theme_dir, 'sections', 'product-showcase.liquid'), 'w', encoding='utf-8') as f:
    f.write(showcase_liquid)

# 3. Update assets/theme.css
theme_css = """/* ==========================================================================
   REVENUERECOVER AI — HIGH-TRUST SHOPIFY THEME STYLES
   ========================================================================== */

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  background: #090d16;
  color: #f8fafc;
  line-height: 1.6;
  padding-bottom: 90px;
}

/* Top Announcement Bar */
.announcement-bar {
  background: linear-gradient(90deg, #059669, #0d9488);
  color: white;
  text-align: center;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

/* Header */
.site-header {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1e293b;
}
.site-header .logo {
  font-size: 22px;
  font-weight: 900;
  color: white;
  text-decoration: none;
}
.site-header .logo span { color: #10b981; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-header-link {
  font-size: 12px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #334155;
  transition: all 0.2s;
}
.btn-header-link:hover {
  color: white;
  border-color: #10b981;
}
.btn-header-chat {
  font-size: 12px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.4);
  text-decoration: none;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 8px;
  transition: all 0.2s;
}
.btn-header-chat:hover {
  background: #10b981;
  color: #090d16;
}

/* Container */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* Product Hero */
.product-hero {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 48px;
  align-items: start;
  margin-bottom: 60px;
}

.mockup-card {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border: 1px solid #334155;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  position: sticky;
  top: 20px;
}
.live-pulse {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.live-dot {
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
}

.mockup-box {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 18px;
  margin: 18px 0;
}
.sms-bubble {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 12px;
  color: #e2e8f0;
  margin-bottom: 10px;
}

.product-info h1 {
  font-size: 28px;
  font-weight: 900;
  color: white;
  line-height: 1.25;
  margin-bottom: 12px;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 18px;
}
.stars { color: #f59e0b; font-size: 15px; }

/* Plan Switcher */
.plan-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: #0f172a;
  padding: 6px;
  border-radius: 14px;
  border: 1px solid #334155;
  margin-bottom: 20px;
}
.plan-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.plan-btn.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #090d16;
}

.price-box {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 18px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.price-current {
  font-size: 38px;
  font-weight: 900;
  color: #10b981;
  font-family: monospace;
}

.features-list {
  list-style: none;
  margin-bottom: 24px;
}
.features-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #cbd5e1;
  padding: 8px 0;
  border-bottom: 1px solid #1e293b;
}
.features-list li span.check {
  color: #10b981;
  font-weight: 900;
}

.buy-btn-primary {
  display: block;
  width: 100%;
  text-align: center;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #090d16;
  font-size: 16px;
  font-weight: 900;
  padding: 18px;
  border-radius: 16px;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.35);
  transition: all 0.2s ease;
}
.buy-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(16, 185, 129, 0.5);
}

/* ROI Calculator */
.roi-section {
  background: linear-gradient(180deg, #0f172a, #0b111e);
  border: 1px solid #1e293b;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 48px;
}
.calc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}
.calc-controls {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 18px;
  padding: 24px;
}
.custom-slider {
  width: 100%;
  accent-color: #10b981;
  cursor: pointer;
  height: 6px;
  border-radius: 4px;
}
.calc-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.calc-stat-box {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 18px;
  padding: 20px 24px;
}
.calc-stat-box.highlight {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.05);
}

/* Reviews & Testimonials */
.trust-section {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 48px;
}
.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-top: 24px;
}
.test-card {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 22px;
}

/* FAQ Accordion */
.faq-section {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 48px;
}
.faq-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.faq-item {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 14px;
  overflow: hidden;
}
.faq-question {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
  cursor: pointer;
  user-select: none;
}
.faq-icon {
  font-size: 18px;
  color: #10b981;
  transition: transform 0.2s;
}
.faq-answer {
  display: none;
  padding: 0 20px 18px;
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
  border-top: 1px solid #1e293b;
  padding-top: 14px;
}
.faq-item.active .faq-answer { display: block; }
.faq-item.active .faq-icon { transform: rotate(45deg); }

/* Brochure Banner */
.brochure-banner {
  background: linear-gradient(90deg, #1e293b, #0f172a);
  border: 1px solid #334155;
  border-radius: 20px;
  padding: 28px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.btn-brochure-download {
  background: #090d16;
  color: white;
  border: 1px solid #334155;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-brochure-download:hover {
  border-color: #10b981;
  color: #10b981;
}

/* Floating WhatsApp */
.floating-whatsapp {
  position: fixed;
  bottom: 85px;
  right: 24px;
  background: #25d366;
  color: #090d16;
  font-weight: 900;
  font-size: 13px;
  padding: 10px 18px;
  border-radius: 100px;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 99;
  transition: transform 0.2s;
}
.floating-whatsapp:hover {
  transform: translateY(-2px);
}

/* Sticky Checkout Bar */
.sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(9, 13, 22, 0.95);
  border-top: 1px solid #1e293b;
  padding: 12px 24px;
  z-index: 100;
}
.sticky-content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sticky-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #090d16;
  font-weight: 900;
  padding: 12px 28px;
  border-radius: 100px;
  text-decoration: none;
  font-size: 14px;
}

/* Footer */
.site-footer {
  background: #090d16;
  border-top: 1px solid #1e293b;
  padding: 30px 24px;
  text-align: center;
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 768px) {
  .product-hero { grid-template-columns: 1fr; }
  .calc-grid { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .brochure-banner { flex-direction: column; text-align: center; }
  .mockup-card { position: static; }
}
"""

with open(os.path.join(theme_dir, 'assets', 'theme.css'), 'w', encoding='utf-8') as f:
    f.write(theme_css)

# 4. Update assets/theme.js
theme_js = """// RevenueRecover AI — Theme Javascript & Interactive Functions

// 1. Plan Switcher
function switchPlan(type) {
  const btnMonthly = document.getElementById('btn-monthly');
  const btnAnnual = document.getElementById('btn-annual');
  const planLabel = document.getElementById('plan-label');
  const priceDisplay = document.getElementById('price-display');
  const priceOrig = document.getElementById('price-orig');
  const saveTag = document.getElementById('save-tag');
  const periodText = document.getElementById('period-text');
  const leadsCount = document.getElementById('leads-count');
  const primaryBuyBtn = document.getElementById('primary-buy-btn');
  const stickyPrice = document.getElementById('sticky-price');
  const stickyPlan = document.getElementById('sticky-plan');
  const stickyBtn = document.getElementById('sticky-btn');

  if (type === 'annual') {
    if (btnMonthly) btnMonthly.classList.remove('active');
    if (btnAnnual) btnAnnual.classList.add('active');

    if (planLabel) planLabel.innerText = 'Annual VIP Commercial License';
    if (priceDisplay) priceDisplay.innerText = '$990';
    if (priceOrig) priceOrig.innerText = '$1,428';
    if (saveTag) saveTag.innerText = 'SAVE $438/YR • VIP MULTI-LOCATION & PRIORITY SUPPORT';
    if (periodText) periodText.innerText = 'USD / Year';
    if (leadsCount) leadsCount.innerText = '500+ Verified Local Leads Included (VIP Tier):';

    if (primaryBuyBtn) {
      primaryBuyBtn.href = 'https://www.paypal.com/ncp/payment/ZKXHXXNDN4D7J';
      primaryBuyBtn.innerText = '⚡ Instant VIP Checkout ($990/yr via PayPal)';
    }

    if (stickyPrice) stickyPrice.innerText = '$990 / yr';
    if (stickyPlan) stickyPlan.innerText = 'VIP Annual License • 500+ Leads Included';
    if (stickyBtn) stickyBtn.href = 'https://www.paypal.com/ncp/payment/ZKXHXXNDN4D7J';
  } else {
    if (btnAnnual) btnAnnual.classList.remove('active');
    if (btnMonthly) btnMonthly.classList.add('active');

    if (planLabel) planLabel.innerText = 'Monthly Growth Subscription';
    if (priceDisplay) priceDisplay.innerText = '$119';
    if (priceOrig) priceOrig.innerText = '$299';
    if (saveTag) saveTag.innerText = 'SAVE 60% TODAY • 1-CLICK INSTANT ACTIVATION';
    if (periodText) periodText.innerText = 'USD / Month';
    if (leadsCount) leadsCount.innerText = '150–200 Verified Local Leads Included:';

    if (primaryBuyBtn) {
      primaryBuyBtn.href = 'https://www.paypal.com/ncp/payment/GFXAWMG4S227E';
      primaryBuyBtn.innerText = '⚡ Instant Checkout with PayPal / Card ($119/mo)';
    }

    if (stickyPrice) stickyPrice.innerText = '$119 / mo';
    if (stickyPlan) stickyPlan.innerText = 'Growth Plan • 200 Leads Included';
    if (stickyBtn) stickyBtn.href = 'https://www.paypal.com/ncp/payment/GFXAWMG4S227E';
  }
}

// 2. Interactive ROI Calculator
function updateCalculator() {
  const callsInput = document.getElementById('range-calls');
  const ticketInput = document.getElementById('range-ticket');
  const valCalls = document.getElementById('val-calls');
  const valTicket = document.getElementById('val-ticket');
  const resLost = document.getElementById('res-lost');
  const resRecovered = document.getElementById('res-recovered');
  const resMultiplier = document.getElementById('res-multiplier');

  if (!callsInput || !ticketInput) return;

  const calls = parseInt(callsInput.value) || 5;
  const ticket = parseInt(ticketInput.value) || 1500;

  valCalls.innerText = calls + ' calls';
  valTicket.innerText = '$' + ticket.toLocaleString();

  // Monthly Lost = calls/week * 4.33 weeks * ticket
  const monthlyLost = Math.round(calls * 4.333 * ticket);
  // Conservative 65% recovery rate
  const monthlyRecovered = Math.round(monthlyLost * 0.65);
  const roiMultiplier = Math.round(monthlyRecovered / 119);

  resLost.innerText = '$' + monthlyLost.toLocaleString();
  resRecovered.innerText = '$' + monthlyRecovered.toLocaleString() + ' / mo';
  resMultiplier.innerText = '⚡ ' + roiMultiplier + 'x Return on your $119/mo plan';
}

// 3. FAQ Accordion Toggle
function toggleFaq(element) {
  const item = element.parentElement;
  item.classList.toggle('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCalculator();
});
"""

with open(os.path.join(theme_dir, 'assets', 'theme.js'), 'w', encoding='utf-8') as f:
    f.write(theme_js)

# 5. Re-package ZIP
import zipfile, shutil
zip_dest = r"C:\Users\Lenovo\.gemini\antigravity\scratch\revenuerecover-ai-ecosystem\RevenueRecover_AI_Shopify_Theme.zip"
desktop_dest = r"C:\Users\Lenovo\Desktop\RevenueRecover_AI_Shopify_Theme.zip"

with zipfile.ZipFile(zip_dest, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(theme_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, theme_dir).replace('\\\\', '/').replace('\\', '/')
            zipf.write(file_path, arcname)

shutil.copyfile(zip_dest, desktop_dest)
print("SUCCESS: Enhanced Shopify Theme packaged to Desktop!")
