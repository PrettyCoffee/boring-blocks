import { styled, css } from "storybook/theming"

const table = styled.table(
  ({ theme: { background } }) => css`
    border-collapse: collapse;
    td,
    th {
      padding: 0.5rem 1rem;
    }
    th {
      text-align: start;
    }
    tr:nth-of-type(2n) > td {
      background-color: ${background.app};
    }
  `
)

export const mdxComponents = {
  table,
}
