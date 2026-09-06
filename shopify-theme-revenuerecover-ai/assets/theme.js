// RevenueRecover AI — Theme Javascript & Interactive Functions

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

// 4. Checkout Modal Controller
const PAYPAL_GATEWAYS = {
  monthly: 'https://www.paypal.com/ncp/payment/GFXAWMG4S227E',
  annual: 'https://www.paypal.com/ncp/payment/ZKXHXXNDN4D7J'
};

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalPaypalBtn = document.getElementById('modal-paypal-btn');
  const isAnnual = document.getElementById('btn-annual') && document.getElementById('btn-annual').classList.contains('active');

  if (!modal) return;

  if (isAnnual) {
    if (modalTitle) modalTitle.innerText = 'RevenueRecover AI — VIP Annual License';
    if (modalPrice) modalPrice.innerHTML = '$990.00 <span style="font-size: 13px; color: #94a3b8; font-weight: normal;">USD / Year (Save $438)</span>';
    if (modalPaypalBtn) modalPaypalBtn.href = PAYPAL_GATEWAYS.annual;
  } else {
    if (modalTitle) modalTitle.innerText = 'RevenueRecover AI — Monthly Growth Plan';
    if (modalPrice) modalPrice.innerHTML = '$119.00 <span style="font-size: 13px; color: #94a3b8; font-weight: normal;">USD / Month (Cancel Anytime)</span>';
    if (modalPaypalBtn) modalPaypalBtn.href = PAYPAL_GATEWAYS.monthly;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = 'auto';
}

function handleBackdropClick(e) {
  if (e.target.id === 'checkout-modal') {
    closeCheckoutModal();
  }
}

function launchPayPalPopup(e) {
  e.preventDefault();
  const isAnnual = document.getElementById('btn-annual') && document.getElementById('btn-annual').classList.contains('active');
  const url = isAnnual ? PAYPAL_GATEWAYS.annual : PAYPAL_GATEWAYS.monthly;
  const width = 580;
  const height = 750;
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);

  const popup = window.open(
    url,
    'PayPalCheckout',
    'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left + ',scrollbars=yes,resizable=yes'
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    window.location.href = url;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCalculator();
});
