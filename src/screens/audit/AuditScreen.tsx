import { AppCard, AppHeader, AppScreen, AppText } from '../../components/ui';
import { useTranslation } from '../../hooks/useTranslation';

export function AuditScreen() {
  const { t } = useTranslation();

  return (
    <AppScreen header={<AppHeader title={t('audit.title')} showBack />}>
      <AppCard variant="soft">
        <AppText variant="body">{t('audit.comingSoon')}</AppText>
      </AppCard>
    </AppScreen>
  );
}
