<template>
  <UDashboardSearchButton
    :label="t('admin.search')"
    :disabled="!hasActiveGoals"
    class="w-full"
    variant="soft"
    size="xl"
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useAtlasGP } from '@/composables/useAtlasGP'

const { t } = useI18n()
const { hasActiveGoals } = useAtlasGP()
</script>
