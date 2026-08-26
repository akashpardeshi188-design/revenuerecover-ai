export interface AICompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  agentName: string;
  responseFormat?: 'json' | 'text';
}

export interface AICompletionResult {
  content: string;
  provider: 'gemini' | 'openai' | 'anthropic' | 'deterministic_fallback';
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number; // in USD
  isFallback: boolean;
}

export interface AICostLog {
  id: string;
  timestamp: string;
  agentName: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export class AIService {
  private costLogs: AICostLog[] = [];
  private totalCost = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rr_ai_cost_logs');
        if (saved) {
          this.costLogs = JSON.parse(saved);
          this.totalCost = this.costLogs.reduce((acc, curr) => acc + curr.cost, 0);
        }
      } catch (e) {
        console.warn('Failed to load AI cost logs', e);
      }
    }
  }

  public async generateCompletion(options: AICompletionOptions): Promise<AICompletionResult> {
    const apiKeyGemini = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY || process.env?.GOOGLE_API_KEY : undefined;
    const apiKeyOpenAI = typeof process !== 'undefined' ? process.env?.OPENAI_API_KEY : undefined;
    const apiKeyAnthropic = typeof process !== 'undefined' ? process.env?.ANTHROPIC_API_KEY : undefined;

    // Check if live API is configured and attempt call
    if (apiKeyGemini) {
      try {
        const res = await this.callGemini(apiKeyGemini, options);
        this.recordCost(res);
        return res;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to deterministic engine', err);
      }
    }

    if (apiKeyOpenAI) {
      try {
        const res = await this.callOpenAI(apiKeyOpenAI, options);
        this.recordCost(res);
        return res;
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to deterministic engine', err);
      }
    }

    if (apiKeyAnthropic) {
      try {
        const res = await this.callAnthropic(apiKeyAnthropic, options);
        this.recordCost(res);
        return res;
      } catch (err) {
        console.warn('Anthropic API call failed, falling back to deterministic engine', err);
      }
    }

    // High-fidelity deterministic heuristic simulation
    const result = this.generateDeterministicFallback(options);
    this.recordCost(result);
    return result;
  }

  private async callGemini(apiKey: string, options: AICompletionOptions): Promise<AICompletionResult> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${options.systemPrompt}\n\nTask:\n${options.userPrompt}` }] }
        ],
        generationConfig: {
          temperature: options.temperature || 0.4,
          maxOutputTokens: options.maxTokens || 800,
          responseMimeType: options.responseFormat === 'json' ? 'application/json' : 'text/plain'
        }
      })
    });

    if (!response.ok) throw new Error(`Gemini error: ${response.statusText}`);
    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const inputTokens = Math.ceil((options.systemPrompt.length + options.userPrompt.length) / 4);
    const outputTokens = Math.ceil(content.length / 4);
    const estimatedCost = (inputTokens * 0.000000075) + (outputTokens * 0.0000003);

    return {
      content,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      inputTokens,
      outputTokens,
      estimatedCost,
      isFallback: false
    };
  }

  private async callOpenAI(apiKey: string, options: AICompletionOptions): Promise<AICompletionResult> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: options.systemPrompt },
          { role: 'user', content: options.userPrompt }
        ],
        temperature: options.temperature || 0.4,
        max_tokens: options.maxTokens || 800,
        response_format: options.responseFormat === 'json' ? { type: 'json_object' } : undefined
      })
    });

    if (!response.ok) throw new Error(`OpenAI error: ${response.statusText}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const inputTokens = data.usage?.prompt_tokens || 150;
    const outputTokens = data.usage?.completion_tokens || 100;
    const estimatedCost = (inputTokens * 0.00000015) + (outputTokens * 0.0000006);

    return {
      content,
      provider: 'openai',
      model: 'gpt-4o-mini',
      inputTokens,
      outputTokens,
      estimatedCost,
      isFallback: false
    };
  }

  private async callAnthropic(apiKey: string, options: AICompletionOptions): Promise<AICompletionResult> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        system: options.systemPrompt,
        messages: [{ role: 'user', content: options.userPrompt }],
        max_tokens: options.maxTokens || 800,
        temperature: options.temperature || 0.4
      })
    });

    if (!response.ok) throw new Error(`Anthropic error: ${response.statusText}`);
    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    const inputTokens = data.usage?.input_tokens || 150;
    const outputTokens = data.usage?.output_tokens || 100;
    const estimatedCost = (inputTokens * 0.00000025) + (outputTokens * 0.00000125);

    return {
      content,
      provider: 'anthropic',
      model: 'claude-3-haiku-20240307',
      inputTokens,
      outputTokens,
      estimatedCost,
      isFallback: false
    };
  }

  private generateDeterministicFallback(options: AICompletionOptions): AICompletionResult {
    const prompt = options.userPrompt.toLowerCase();
    const agent = options.agentName.toLowerCase();
    let content = '';

    if (options.responseFormat === 'json') {
      if (agent.includes('recovery')) {
        content = JSON.stringify({
          action: 'send_sms_reengagement',
          confidence: 94,
          message: 'Hi John, this is Summit HVAC following up on your AC system quote from Tuesday. We have a technician in your neighborhood tomorrow afternoon—would you like us to lock in your install slot?',
          tone: 'helpful_direct',
          urgency: 'high'
        });
      } else if (agent.includes('lead') || agent.includes('research')) {
        content = JSON.stringify({
          business_name: 'Lone Star Mechanical Pros',
          signals: ['Online service request form found', 'Phone line busy during peak heat hours', 'Quote workflow lacks automated SMS follow-up'],
          missed_call_risk: 'high',
          quote_workflow: 'Manual email PDF estimate',
          online_booking_present: false,
          estimated_opportunity_range: '$12,000 - $28,000/mo',
          recommended_pitch: 'Recover missed high-ticket AC & furnace estimates automatically before competitors call back.'
        });
      } else if (agent.includes('sales')) {
        content = JSON.stringify({
          qualification: 'HOT_LEAD',
          score: 92,
          intent: 'high',
          objection_handling: 'We integrate directly with ServiceTitan and Housecall Pro in 3 minutes with zero coding.',
          recommended_plan: 'Growth ($149/mo)',
          next_step: 'start_free_trial'
        });
      } else {
        content = JSON.stringify({
          status: 'success',
          analysis: 'Prospect displays 84% conversion likelihood based on HVAC service profile and $1,400 avg job size.',
          recommendation: 'Schedule interactive simulation demo.'
        });
      }
    } else {
      if (agent.includes('sales')) {
        if (prompt.includes('cost') || prompt.includes('pricing') || prompt.includes('how much')) {
          content = "RevenueRecover AI offers three simple tiers: Starter at $49/mo (up to 50 recoveries/mo), Growth at $149/mo (unlimited workflows & CRM sync), and Pro at $299/mo with full multi-location autopilot. Most HVAC and plumbing businesses make back their entire annual subscription in their very first recovered job. You can test it completely free with our 14-day trial.";
        } else if (prompt.includes('servicetitan') || prompt.includes('crm') || prompt.includes('integration')) {
          content = "Yes, RevenueRecover AI integrates seamlessly with ServiceTitan, Housecall Pro, Jobber, QuickBooks, and HubSpot. When a quote is sent or an unbooked call comes in, our AI detects the event instantly and initiates human-supervised follow-ups without manual data entry.";
        } else if (prompt.includes('sms') || prompt.includes('message') || prompt.includes('approval')) {
          content = "You have 100% control! You can choose 'Copilot Mode' where every AI message is presented for your 1-click review, 'Supervised Mode' where standard follow-ups go automatically while exceptions are flagged, or 'Full Autopilot'. You also have a global 1-click kill switch at any time.";
        } else {
          content = "RevenueRecover AI is your 24/7 AI Revenue Recovery employee. We automatically spot missed calls, unbooked quotes, failed payments, and dormant seasonal customers—and follow up with friendly, high-converting messages that get customers back on your schedule.";
        }
      } else if (agent.includes('success')) {
        content = "Great job! Your Revenue Recovery Agent has recovered $8,420 for Summit HVAC this month. To increase your recovery rate by another ~18%, I recommend enabling automated missed-call instant text-backs under Settings > Business Rules.";
      } else {
        content = "AI analysis completed. Based on historical data, engaging this prospect via SMS within 15 minutes yields a 74% higher rebooking rate compared to standard email outreach.";
      }
    }

    const inputTokens = Math.ceil((options.systemPrompt.length + options.userPrompt.length) / 4);
    const outputTokens = Math.ceil(content.length / 4);
    const estimatedCost = (inputTokens * 0.0000001) + (outputTokens * 0.0000003);

    return {
      content,
      provider: 'deterministic_fallback',
      model: 'deterministic-heuristic-v2',
      inputTokens,
      outputTokens,
      estimatedCost,
      isFallback: true
    };
  }

  private recordCost(res: AICompletionResult): void {
    const entry: AICostLog = {
      id: `cost_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      agentName: 'AI Engine',
      provider: res.provider,
      model: res.model,
      inputTokens: res.inputTokens,
      outputTokens: res.outputTokens,
      cost: res.estimatedCost
    };
    this.costLogs.unshift(entry);
    if (this.costLogs.length > 500) this.costLogs = this.costLogs.slice(0, 500);
    this.totalCost += res.estimatedCost;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rr_ai_cost_logs', JSON.stringify(this.costLogs));
      } catch (e) {
        // storage quota
      }
    }
  }

  public getCostMetrics() {
    return {
      totalCost: this.totalCost,
      totalCalls: this.costLogs.length,
      logs: this.costLogs.slice(0, 30)
    };
  }
}

export const aiService = new AIService();
