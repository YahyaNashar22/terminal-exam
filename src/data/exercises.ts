import type { Exercise } from '@/types/exercise'

export const exercise: Exercise[] = [
  {
    id: 1,
    title: 'Print the current directory',
    description: 'Use a terminal command to print your current directory',
    hint: 'Use pwd',
    points: 10,
    validate: (state) => state.history.some((command) => command.trim() === 'pwd'),
  },

  {
    id: 2,
    title: 'Create a projects directory',
    description: 'Create a directory named projects inside your home folder.',
    hint: 'Use mkdir followed by the directory name.',
    points: 15,

    validate: (state) => state.nodes['/home/student/projects']?.type === 'directory',
  },

  {
    id: 3,
    title: 'Open the projects directory',
    description: 'Change your current directory to projects',
    hint: 'Use cd',
    points: 15,

    validate: (state) => state.currentDirectory === '/home/student/projects',
  },

  {
    id: 4,
    title: 'Create a text file',
    description: 'Create notes.txt inside the projects directory',
    hint: 'Use touch',
    points: 20,

    validate: (state) => state.nodes['/home/student/projects/notes.txt']?.type === 'file',
  },

  {
    id: 5,
    title: 'Write into the file',
    description: 'Write terminal exam into notes.txt',
    hint: 'Try echo terminal exam > notes.txt',
    points: 25,

    validate: (state) =>
      state.nodes['/home/student/projects/notes.txt']?.content?.trim() === 'terminal exam',
  },
]
