import type { ProjectDetailsTab } from './project-details.shared'
import {
  ProjectApiKeysTab,
  ProjectAuthPolicyTab,
  ProjectMembersTab,
  ProjectPasswordPolicyTab,
  ProjectSessionsTab,
  ProjectUsersTab,
} from './tabs'
import { TabPanel } from './style'

type ProjectDetailsTabContentProps = {
  activeTab: ProjectDetailsTab
  projectId: string
}

export function ProjectDetailsTabContent({ activeTab, projectId }: ProjectDetailsTabContentProps) {
  return (
    <TabPanel
      id={`project-tab-panel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`project-tab-${activeTab}`}
    >
      <ProjectSessionsTab isActive={activeTab === 'sessions'} projectId={projectId} />
      <ProjectUsersTab isActive={activeTab === 'users'} projectId={projectId} />
      <ProjectMembersTab isActive={activeTab === 'members'} projectId={projectId} />
      <ProjectPasswordPolicyTab isActive={activeTab === 'password-policy'} projectId={projectId} />
      <ProjectAuthPolicyTab isActive={activeTab === 'auth-policy'} projectId={projectId} />
      <ProjectApiKeysTab isActive={activeTab === 'api-keys'} projectId={projectId} />
    </TabPanel>
  )
}
