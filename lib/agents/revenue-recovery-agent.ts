import { Opportunity, Customer, Channel, AIResponseClassification } from '../types';
import { aiService } from '../ai/provider';
import { ScoringEngine } from '../scoring-engine';

export class RevenueRecoveryAgent {
  public static async analyzeAndRecommend(opportunity: Opportunity, customer?: Customer) {
    const scoreResult = ScoringEngine.scoreRecoveryOpportunity({
      type: opportunity.type,
      estimated_value: opportunity.estimated_value,
      customer_ltv: customer?.lifetime_value || 3000,
      customer_purchase_count: customer?.total_purchases || 2,
      days_since_trigger: 3,
      urgency: opportunity.urgency,
    });

    const prompt = `
You are the AI Revenue Recovery Agent for a high-ticket home service business (e.g. HVAC, Plumbing, Roofing).
Target Customer: ${opportunity.customer_name}
Opportunity Type: ${opportunity.type}
Estimated Value: $${opportunity.estimated_value}
Customer Past LTV: $${customer?.lifetime_value || 2500}
Recommended Channel: ${scoreResult.recommended_channel}

Generate an ultra-personalized, non-pushy, high-converting follow-up message (under 60 words for SMS, or under 120 words for Email) that addresses their specific situation, creates easy booking friction, and mentions any available financing or seasonal slot.
`;

    const res = await aiService.generateCompletion({
      agentName: 'RevenueRecoveryAgent',
      systemPrompt: 'You are an expert AI Revenue Recovery Employee specializing in US home service customer reactivation and quote follow-ups. Always write friendly, concise, natural-sounding messages.',
      userPrompt: prompt,
      temperature: 0.3,
    });

    return {
      message: res.content,
      score: scoreResult.score,
      reasons: scoreResult.reasons,
      channel: scoreResult.recommended_channel,
      confidence: res.isFallback ? 92 : 96,
      provider: res.provider,
    };
  }

  public static classifyCustomerReply(messageText: string): {
    classification: AIResponseClassification;
    confidence: number;
    suggestedReply: string;
    needsHuman: boolean;
  } {
    const lower = messageText.toLowerCase();

    if (lower.includes('stop') || lower.includes('unsubscribe') || lower.includes('cancel my number')) {
      return {
        classification: 'stop_unsubscribe',
        confidence: 99,
        suggestedReply: 'You have been unsubscribed and will receive no further messages. Reply START to resubscribe.',
        needsHuman: false,
      };
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('estimate') || lower.includes('financing')) {
      return {
        classification: 'pricing_question',
        confidence: 94,
        suggestedReply: 'We provide transparent itemized estimates with 0% APR financing options available. Would you like our specialist to walk you through the details?',
        needsHuman: false,
      };
    }

    if (lower.includes('book') || lower.includes('schedule') || lower.includes('today') || lower.includes('tomorrow') || lower.includes('come out') || lower.includes('time')) {
      return {
        classification: 'ready_to_book',
        confidence: 96,
        suggestedReply: 'Great! We have a licensed technician available in your area tomorrow between 9:00 AM - 12:00 PM or 1:00 PM - 4:00 PM. Which window works best for you?',
        needsHuman: false,
      };
    }

    if (lower.includes('angry') || lower.includes('terrible') || lower.includes('lawyer') || lower.includes('refund') || lower.includes('sue') || lower.includes('speak to manager')) {
      return {
        classification: 'angry_customer',
        confidence: 98,
        suggestedReply: 'I completely understand your frustration and have flagged this immediately for our General Manager Dave to call you directly.',
        needsHuman: true,
      };
    }

    if (lower.includes('already got someone') || lower.includes('fixed it') || lower.includes('went with another')) {
      return {
        classification: 'already_purchased',
        confidence: 92,
        suggestedReply: 'Thanks for letting us know! Glad you got it taken care of. Keep our number handy for any future seasonal tune-ups or warranty service.',
        needsHuman: false,
      };
    }

    return {
      classification: 'information_request',
      confidence: 88,
      suggestedReply: 'Thanks for getting back to us! How can we best assist you with your project today?',
      needsHuman: false,
    };
  }
}
