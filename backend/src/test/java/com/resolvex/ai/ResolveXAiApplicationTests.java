package com.resolvex.ai;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import com.resolvex.ai.repository.*;

@SpringBootTest
@MockBean({
    MongoTemplate.class,
    MongoDatabaseFactory.class,
    MongoConverter.class,
    GridFsTemplate.class,
    APIKeyRepository.class,
    AnalyticsRepository.class,
    ApprovalRepository.class,
    AssignmentRepository.class,
    AuditRepository.class,
    BackupRepository.class,
    ChatMessageRepository.class,
    ChatRepository.class,
    DashboardRepository.class,
    EscalationRepository.class,
    FeatureFlagRepository.class,
    IncidentRepository.class,
    InsightRepository.class,
    KnowledgeRepository.class,
    NotificationRepository.class,
    PermissionRepository.class,
    ReportRepository.class,
    RoleRepository.class,
    RunbookRepository.class,
    SettingsRepository.class,
    TemplateRepository.class,
    UserRepository.class,
    WorkflowRepository.class,
    LogRepository.class,
    ExecutionLogRepository.class
})
class ResolveXAiApplicationTests {

    @Test
    void contextLoads() {
    }
}
