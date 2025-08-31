# HTML/ CSS

<details><summary>Custom Fonts in CSS</summary>

Paste the following code into your `index.css`

```css
@font-face {
  font-family: "Montserrat";
  src: url("./assets/font/MerriweatherSans-VariableFont_wght.woff2");
}

:root {
  --font-family-<font-name>: "Montserrat", sans-serif;
}

body {
  font-family: var(--font-family-<font-name>);
}
```

</details>
<details><summary>Var() in CSS</summary>

Paste the following code into your `index.css`

```css
:root {
  --font-family-<font-name>: "Montserrat", sans-serif;

  /* sizes */
  --size-xxs: 0.5rem;
  --size-xs: 0.75rem;
  --size-sm: 0.875rem;
  --size-base: 1rem;
  --size-lg: 1.125rem;
  --size-xl: 1.25rem;
  --size-2x1: 1.5rem;
  --size-3xl: 1.875rem;
  --size-4x1: 2.25rem;
  --size-5xl: 3rem;
  --size-6xl: 3.75rem;
  --size-7x1: 4.5rem;
  --size-8x1: 6rem;
  --size-9x1: 8rem;
  --size-10x1: 10rem;
}
```

</details>
