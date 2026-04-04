export type PageTitleProps = React.ComponentProps<"div"> & { pageTitle: React.ReactNode; subtitle: React.ReactNode };

export const PageTitle = ({ pageTitle, subtitle, ...props }: PageTitleProps) => {
  return (
    <div {...props}>
      <h1 className="text-xl font-semibold text-fg">{pageTitle}</h1>
      <p className="mt-0.5 text-sm text-dim">{subtitle}</p>
    </div>
  );
};
