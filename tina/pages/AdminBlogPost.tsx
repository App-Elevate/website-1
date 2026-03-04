import React from 'react';
import { tinaField, useTina } from "tinacms/dist/react";
import type { BlogQuery, BlogQueryVariables } from '../__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import FormattedDate from '../../src/components/react/FormattedDate.tsx';
import { resolveImagePath } from "../../utils/media";


type Props = {
	variables: BlogQueryVariables;
	data: BlogQuery;
	query: string;
}

export default function AdminBlogPost(props: Props) {

	const { data } = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const blog = data.blog;
	const heroImageSrc = resolveImagePath(blog.heroImage ?? undefined);

	return (
		<article>
			<div data-tina-field={tinaField(blog, "heroImage")} className="hero-image">
				{heroImageSrc && <img width={1020} height={510} src={heroImageSrc} alt="" />}
			</div>
			<div className="prose">
				<div className="title">
					<div className="date" data-tina-field={tinaField(blog, "pubDate")} >
						<FormattedDate date={blog.pubDate} />
						{
							blog.updatedDate && (
								<div className="last-updated-on" data-tina-field={tinaField(blog, "updatedDate")} >
									Last updated on <FormattedDate date={blog.updatedDate} />
								</div>
							)
						}
					</div>
					<h1 data-tina-field={tinaField(blog, "title")} >{blog.title}</h1>
					<hr />
				</div>
				<div data-tina-field={tinaField(blog, "body")}>
					<TinaMarkdown content={blog.body} />
				</div>
			</div>
		</article>
	);
}
