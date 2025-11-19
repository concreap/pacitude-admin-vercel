import Task from "../models/Task.model";
import { IMarkdown } from "./interfaces.util";


const heading = (level: number, text: string) => {
    return `${'#'.repeat(level)} ${text}\n\n`;
}

const kvList = (obj: Record<string, any>) => {
    return Object.entries(obj)
        .map(([k, v]) => `- **${k}**: ${String(v ?? '')}`)
        .join('\n') + '\n\n';
}

const arrayToList = (arr: any[]) => {
    return arr.map((it) => `- ${typeof it === 'string' ? it : JSON.stringify(it)}`).join('\n') + '\n\n';
}

export function taskToMarkdown(t: Task) {
    const md: string[] = [];

    // Header that matches README structure
    md.push(heading(1, 'Software Engineering Week 8 Challenge'));
    md.push('\n');

    // Challenge Title (use task.title if present)
    md.push(heading(2, 'Challenge Title'));
    md.push(`**${t.title ?? 'Untitled Challenge'}**\n\n`);

    // Scenario / Description
    md.push(heading(2, 'Scenario / Description'));
    md.push(`${t.description ?? 'No description provided.'}\n\n`);

    // Challenge Overview - try mapping from task fields where sensible
    md.push(heading(2, 'Challenge Overview'));
    const overviewItems: string[] = [];

    // Map some known fields to overview bullet points, or default guidance
    overviewItems.push('Set up a Node.js (Express) backend and a React-Vite frontend.');
    overviewItems.push('Implement a CI/CD pipeline (GitHub Actions) and containerization (Docker).');
    overviewItems.push('Integrate observability (logs, metrics, basic tracing).');

    // Add task-specific hints
    if (t.type) overviewItems.push(`Type: ${t.type}`);
    if (t.level) overviewItems.push(`Level: ${t.level}`);
    if (t.difficulty) overviewItems.push(`Difficulty: ${t.difficulty}`);

    md.push(arrayToList(overviewItems));

    // Instructions (build from task.instructions)
    md.push(heading(2, 'Instructions'));
    if (t.instructions?.length) {
        t.instructions.forEach((inst: any) => {
            md.push(heading(3, inst.title || inst.code || 'Instruction'));
            if (inst.actions?.length) md.push(arrayToList(inst.actions));
        });
    } else {
        md.push('- Follow the README guidance for CI/CD + Observability.\n\n');
    }

    // Requirements (task.requirements)
    if (t.requirements?.length) {
        md.push(heading(2, 'Requirements'));
        md.push(arrayToList(t.requirements));
    }

    // Expected Deliverables (deliverables)
    md.push(heading(2, 'Expected Deliverables'));
    if (t.deliverables?.length) {
        t.deliverables.forEach((d: any) => {
            md.push(`- **${d.title ?? d.code}**`);
            if (d.outcomes?.length) md.push('\n\n' + arrayToList(d.outcomes));
            else md.push('\n');
        });
        md.push('\n');
    } else {
        md.push('- Backend repository with metrics & health checks\n- Frontend repository with CI/CD\n\n');
    }

    // Observability Requirements (derived from README)
    md.push(heading(2, 'Observability Requirements'));
    md.push(arrayToList([
        'Structured logging (Winston or Pino).',
        'Metrics: response time, uptime, error counts (Prometheus client or similar).',
        'Basic health-check endpoint (/api/health).'
    ]));

    // Submission Guidelines — try to follow the README's submission section
    md.push(heading(2, 'Submission Guidelines'));
    md.push('- Create two private GitHub repos: backend and frontend.\n');
    md.push('- Fork the submissions repo, add your week8 folder, and PR to the main repo.\n\n');

    // Duration
    md.push(heading(2, 'Duration'));
    md.push('🗓️ **Challenge Duration:** 1 week (Monday to Friday)\n\n');

    // Resources (map from task.resources)
    if (t.resources?.length) {
        md.push(heading(2, 'Learning Resources'));
        t.resources.forEach((r: any) => {
            const title = r.title ?? r.name ?? 'Resource';
            const url = r.url ? `(${r.url})` : '';
            md.push(`- [${title}]${url} — ${r.description ?? ''}\n`);
        });
        md.push('\n');
    }

    // Submission notes / submission.notes HTML block (rendered raw later)
    if (t.submission?.notes) {
        md.push(heading(2, 'Submission Notes'));
        // Append raw HTML — renderer must use rehype-raw + rehype-sanitize
        md.push(t.submission.notes + '\n\n');
    }

    // Rubrics as a table (if present)
    if (t.rubrics?.length) {
        md.push(heading(2, 'Rubrics'));
        md.push('| Criteria | Description | Point |\n| --- | --- | --- |\n');
        t.rubrics.forEach((r: any) => {
            const crit = (r.criteria ?? '').replace(/\|/g, '\\|');
            const desc = (r.description ?? '').replace(/\|/g, '\\|');
            md.push(`| ${crit} | ${desc} | ${r.point ?? ''} |\n`);
        });
        md.push('\n');
    }

    // Footer metadata
    md.push('---\n\n');
    md.push(`*Created At:* ${t.createdAt ?? 'N/A'}  \n`);
    md.push(`*Updated At:* ${t.updatedAt ?? 'N/A'}  \n`);

    return md.join('');
}


const markdown: IMarkdown = {
    taskToMarkdown: taskToMarkdown
}

export default markdown;