import type { TerminalState } from './terminal'

export interface Exercise {
  id: number
  title: string
  description: string
  hint: string
  points: number
  validate: (state: TerminalState) => boolean
}

// ? Each exercise owns its validation logic.
/* Example:
 ? validate: (state) =>
 ? state.nodes['/home/student/projects']?.type === 'directory'

 is better than using

 ? command === 'mkdir projects'

 because these should all be accepted:
 ? mkdir projects
 ? mkdir ./projects
 ? mkdir /home/student/projects

 */
