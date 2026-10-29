import { useState } from 'react'

const initialTasks = [
  { id: 'build', label: 'Build the image', meta: 'docker build -t app .', done: true },
  { id: 'run', label: 'Run the container', meta: 'docker run -p 8080:80 app', done: true },
  { id: 'compose', label: 'Compose the stack', meta: 'docker compose up', done: false },
]

function Check({ done }) {
  return (
    <span
      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
        done
          ? 'border-emerald-600 bg-emerald-600 text-white'
          : 'border-zinc-300 bg-white text-transparent'
      }`}
    >
      <svg viewBox="0 0 16 16" fill="none" className="size-3" aria-hidden="true">
        <path
          d="M3.5 8.5l3 3 6-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const completed = tasks.filter((task) => task.done).length
  const progress = Math.round((completed / tasks.length) * 100)
  const heading =
    completed === tasks.length
      ? 'All steps complete.'
      : completed === 0
        ? "Let's get started."
        : 'Almost there.'

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    )
  }

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-16">
        <header>
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-md bg-zinc-900">
              <svg viewBox="0 0 16 16" fill="none" className="size-3 text-white" aria-hidden="true">
                <path
                  d="M3.5 8.5l3 3 6-7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
              Docker Basics
            </span>
          </div>

          <h1 className="mt-8 text-3xl font-medium tracking-tight text-balance">{heading}</h1>
          <p className="mt-3 text-sm leading-relaxed text-pretty text-zinc-500">
            You finished {completed} of {tasks.length} steps in this Docker basics module. Tick a
            step below to update your progress.
          </p>
        </header>

        <section className="mt-10" aria-label="Progress">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-zinc-500">Progress</span>
            <span className="text-sm font-medium tabular-nums">
              {completed}/{tasks.length}
            </span>
          </div>
          <div
            className="mt-3 h-1 w-full overflow-hidden rounded-full bg-zinc-100"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Steps completed"
          >
            <div
              className="h-full rounded-full bg-zinc-900 transition-[width] duration-200 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <ul className="mt-8 divide-y divide-zinc-100 border-y border-zinc-200">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                aria-pressed={task.done}
                className="group flex w-full items-start gap-3 py-4 text-left transition-opacity duration-150 hover:opacity-70 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                <Check done={task.done} />
                <span className="min-w-0">
                  <span
                    className={`block text-sm ${
                      task.done ? 'text-zinc-400 line-through' : 'font-medium text-zinc-900'
                    }`}
                  >
                    {task.label}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-xs text-zinc-400">
                    {task.meta}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <footer className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setTasks(initialTasks)}
            className="text-sm text-zinc-500 underline-offset-4 transition-colors duration-150 hover:text-zinc-900 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Reset checklist
          </button>
          <a
            href="https://docs.docker.com/get-started/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Read the guide
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
              <path
                d="M6 3.5h6.5V10M12.5 3.5L3.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </footer>

        <p className="mt-16 text-xs text-zinc-400">
          Static build · Vite + React · Served by Nginx
        </p>
      </main>
    </div>
  )
}
