import React, { useEffect } from "react"
import Task from "../../../models/Task.model";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { taskToMarkdown } from "../../../utils/markdown.util";


interface ITaskMarkdown {
    task: Task,
    className?: string
}

const TaskMarkdown = (props: ITaskMarkdown) => {

    const {
        task,
        className
    } = props;

    const md = React.useMemo(() => taskToMarkdown(task), [task]);

    useEffect(() => {

    }, [])

    return (
        <>
            <div className={`bg-gray-50 p-6 rounded-md ${className ?? ''}`}>
                <article className="prose max-w-none">
                    <ReactMarkdown
                        children={md}
                        remarkPlugins={[remarkGfm]}
                        // allow raw HTML then sanitize it — order matters
                        rehypePlugins={[[rehypeRaw], [rehypeSanitize]]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-6" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-medium mt-4" {...props} />,
                            p: ({ node, ...props }) => <p className="leading-relaxed" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc ml-6" {...props} />,
                            table: ({ node, ...props }) => <table className="table-auto border-collapse" {...props} />,
                            th: ({ node, ...props }) => <th className="border px-2 py-1 bg-gray-100" {...props} />,
                            td: ({ node, ...props }) => <td className="border px-2 py-1" {...props} />,
                        }}
                    />
                </article>
            </div>

        </>
    )
};

export default TaskMarkdown;
