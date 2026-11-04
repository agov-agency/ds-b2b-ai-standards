// Lists show external authors' work first, DemandSense's (and unsigned) last; callers keep their own order inside each group.
export const ds = (e: { data: { author?: { id: string } } }) => Number((e.data.author?.id ?? 'demandsense') === 'demandsense');
