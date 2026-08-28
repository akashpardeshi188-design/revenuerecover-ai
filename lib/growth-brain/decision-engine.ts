/**
 * RevenueRecover AI — Autonomous 3-Tier Decision Engine & Anti-Spam Safety System
 * MASTER SPECIFICATION SECTION 27, 28 & 29
 */

import { complianceEngine } from '../compliance';
import { demoBusinessRules } from '../demo-data';

export type DecisionLevel = 'level_1_autonomous' | 'level_2_rules_based' | 'level_3_human_approval_required';

export interface AutonomousDecision {
  id: string;
  actionName: string;
  level: DecisionLevel;
  category: 'outreach' | 'budget' | 'pricing' | 'content' | 'lifecycle' | 'safety';
  description: string;
  isAllowedAutomatically: boolean;
  requiresHumanApproval: boolean;
  complianceChecks: {
    tcpaQuietHoursPassed: boolean;
    optOutVerified: boolean;
    frequencyCapPassed: boolean;
    riskScore: number; // 0-100 (lower is safer)
  };
}

export class AutonomousDecisionEngine {
  public static evaluateAction(
    actionType: string,
    recipientContact?: string
  ): AutonomousDecision {
    const rules = demoBusinessRules;
    const isQuietHour = complianceEngine.isQuietHours(rules);
    const suppressionList = complianceEngine.getSuppressionList();
    const isSuppressed = recipientContact ? suppressionList.includes(recipientContact.toLowerCase().trim()) : false;

    // Classify action by Level
    if (['generate_content', 'score_lead', 'run_scanner', 'create_report', 'segment_leads'].includes(actionType)) {
      return {
        id: `dec_${Date.now()}`,
        actionName: actionType,
        level: 'level_1_autonomous',
        category: 'content',
        description: 'Internal analytical or drafting task; fully autonomous execution permitted.',
        isAllowedAutomatically: true,
        requiresHumanApproval: false,
        complianceChecks: {
          tcpaQuietHoursPassed: true,
          optOutVerified: true,
          frequencyCapPassed: true,
          riskScore: 5,
        },
      };
    }

    if (['send_cold_email_batch', 'send_sms_followup', 'trigger_trial_reminder'].includes(actionType)) {
      const allowed = !isQuietHour && !isSuppressed && !rules.kill_switch_active;
      return {
        id: `dec_${Date.now()}`,
        actionName: actionType,
        level: 'level_2_rules_based',
        category: 'outreach',
        description: 'Outbound communication execution governed by TCPA quiet hours and suppression lists.',
        isAllowedAutomatically: allowed,
        requiresHumanApproval: !allowed,
        complianceChecks: {
          tcpaQuietHoursPassed: !isQuietHour,
          optOutVerified: !isSuppressed,
          frequencyCapPassed: true,
          riskScore: isSuppressed ? 100 : isQuietHour ? 75 : 12,
        },
      };
    }

    // Default Level 3
    return {
      id: `dec_${Date.now()}`,
      actionName: actionType,
      level: 'level_3_human_approval_required',
      category: 'safety',
      description: 'High-impact business or financial action requiring explicit human authorization.',
      isAllowedAutomatically: false,
      requiresHumanApproval: true,
      complianceChecks: {
        tcpaQuietHoursPassed: !isQuietHour,
        optOutVerified: !isSuppressed,
        frequencyCapPassed: true,
        riskScore: 60,
      },
    };
  }
}
