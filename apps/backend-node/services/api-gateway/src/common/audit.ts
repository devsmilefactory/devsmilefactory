import { LoggerService } from './logger.service';

export interface AuditEvent {
  actorAccountId?: string;
  actorProfileId?: string;
  action: string;
  entity: string;
  entityId?: string;
  outcome: 'success' | 'deny' | 'error';
  reason?: string;
  metadata?: Record<string, unknown>;
}

export class AuditLogger {
  constructor(private readonly logger: LoggerService) {}

  record(event: AuditEvent) {
    const { action, entity, outcome, ...rest } = event;
    this.logger.log(
      JSON.stringify({
        action,
        entity,
        outcome,
        ...rest,
        timestamp: new Date().toISOString(),
      }),
      'AuditLogger',
    );
  }
}
