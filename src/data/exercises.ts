import type { Exercise } from '@/types/exercise'

export const exercises: Exercise[] = [
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

  {
    id: 6,
    title: 'Build a project structure',
    description: 'Inside projects, create two directories named src and docs.',
    hint: 'You can create both directories from the current folder.',
    points: 30,

    validate: (state) =>
      state.nodes['/home/student/projects/src']?.type === 'directory' &&
      state.nodes['/home/student/projects/docs']?.type === 'directory',
  },

  {
    id: 7,
    title: 'Create a source file from inside src',
    description: 'Move into src, create main.txt, and write build started into it.',
    hint: 'This exercise checks both your location and the file content.',
    points: 35,

    validate: (state) =>
      state.currentDirectory === '/home/student/projects/src' &&
      state.nodes['/home/student/projects/src/main.txt']?.content?.trim() === 'build started',
  },

  {
    id: 8,
    title: 'Reach docs using a relative path',
    description: 'From src, move to docs using a relative path and create summary.txt containing draft ready.',
    hint: 'You will likely need .. in the path.',
    points: 40,

    validate: (state) =>
      state.currentDirectory === '/home/student/projects/docs' &&
      state.nodes['/home/student/projects/docs/summary.txt']?.content?.trim() === 'draft ready',
  },

  {
    id: 9,
    title: 'Append a second summary line',
    description: 'Without deleting the first line, append review complete to summary.txt.',
    hint: 'Use append redirection instead of overwrite redirection.',
    points: 45,

    validate: (state) =>
      state.nodes['/home/student/projects/docs/summary.txt']?.content?.trim() ===
      'draft ready\nreview complete',
  },

  {
    id: 10,
    title: 'Return home with tilde',
    description: 'Go back to your home directory using ~ notation.',
    hint: 'This checks your final location.',
    points: 35,

    validate: (state) =>
      state.currentDirectory === '/home/student' &&
      state.history.some((command) => command.trim() === 'cd ~'),
  },

  {
    id: 11,
    title: 'Append using an absolute path',
    description:
      'From your home directory, append final note to /home/student/projects/notes.txt using an absolute path.',
    hint: 'You do not need to cd into the projects directory for this one.',
    points: 45,

    validate: (state) =>
      state.currentDirectory === '/home/student' &&
      state.nodes['/home/student/projects/notes.txt']?.content?.trim() ===
        'terminal exam\nfinal note',
  },

  {
    id: 12,
    title: 'Create a nested report from home',
    description:
      'While staying in your home directory, create docs/report.txt inside the project and write exam complete into it.',
    hint: 'Target the file through its path instead of changing directories.',
    points: 50,

    validate: (state) =>
      state.currentDirectory === '/home/student' &&
      state.nodes['/home/student/projects/docs/report.txt']?.content?.trim() === 'exam complete',
  },
]
