interface ClassNames {
  [className: string]: string;
}

declare module '*.css' {
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.sass' {
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.scss' {
  const classNames: ClassNames;
  export = classNames;
}

declare module '@hyperapp/logger' {
  export function withLogger<T>(app: T): T;
}
