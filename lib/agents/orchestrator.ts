import { eventBus } from '../event-bus';
import { complianceEngine } from '../compliance';
import { storeService } from '../store';
import { RevenueRecoveryAgent } from './revenue-recovery-agent';
import { LeadGenerationAgent } from './lead-generation-agent';
import { ProspectResearchAgent } from './prospect-research-agent';
import { SalesAgent } from './sales-agent';
import { DemoAgent } from './demo-agent';
import { FollowUpAgent } from './followup-agent';
import { CustomerSuccessAgent } from './customer-success-agent';
import { GrowthAnalystAgent } from './growth-analyst-agent';

export interface OrchestratorStatus {
  activeAgents: string[];
  totalActionsExecuted: number;
  lastActionTimestamp: string;
  isAutopilotRunning: boolean;
}

export class AIAgentOrchestrator {
  private static totalActions = 142;
  private static lastAction = new Date().toISOString();
  private static isInitialized = false;

  public static initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Listen to lifecycle events
    eventBus.subscribe('lead.created', async (evt) => {
      this.totalActions++;
      this.lastAction = new Date().toISOString();
      // Trigger research & scoring
    });

    eventBus.subscribe('opportunity.created', async (evt) => {
      this.totalActions++;
      this.lastAction = new Date().toISOString();
      const state = storeService.getState();
      if (state.businessRules.autopilot_mode === 'autopilot' && !state.businessRules.kill_switch_active) {
        const oppId = evt.payload?.opportunityId as string;
        if (oppId) {
          await storeService.triggerOpportunityAction(oppId);
        }
      }
    });

    eventBus.subscribe('revenue.recovered', (evt) => {
      this.totalActions++;
      this.lastAction = new Date().toISOString();
    });
  }

  public static getStatus(): OrchestratorStatus {
    return {
      activeAgents: [
        'RevenueRecoveryAgent',
        'LeadGenerationAgent',
        'ProspectResearchAgent',
        'SalesAgent',
        'DemoAgent',
        'FollowUpAgent',
        'CustomerSuccessAgent',
        'GrowthAnalystAgent',
      ],
      totalActionsExecuted: this.totalActions,
      lastActionTimestamp: this.lastAction,
      isAutopilotRunning: !storeService.getState().businessRules.kill_switch_active,
    };
  }

  // Direct access to agents
  public static readonly RevenueRecovery = RevenueRecoveryAgent;
  public static readonly LeadGeneration = LeadGenerationAgent;
  public static readonly ProspectResearch = ProspectResearchAgent;
  public static readonly Sales = SalesAgent;
  public static readonly Demo = DemoAgent;
  public static readonly FollowUp = FollowUpAgent;
  public static readonly CustomerSuccess = CustomerSuccessAgent;
  public static readonly GrowthAnalyst = GrowthAnalystAgent;
}

// Auto-init orchestrator
if (typeof window !== 'undefined') {
  AIAgentOrchestrator.initialize();
}
