import { createGlobalStyle, keyframes } from "styled-components";
import { normalize } from "styled-normalize";

const appearAnim = keyframes`
from {
	opacity:0;
}
to {
	opacity:1;
}
`;

const GlobalStyle = createGlobalStyle`
   ${normalize};

    *,*::before,*::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        font-size: 62.5%;
    }

    body {
        font-family: ${({ theme }) => theme.fonts.main};
        font-size: 1.6rem;
        background: ${({ theme }) => theme.colors.background.primary};
        color: ${({ theme }) => theme.colors.text.primary};
        ::selection {
            background-color: green;
        }
        transition: background 0.2s ease;
        color: background 0.2s ease;
	    overflow-y: scroll;
    }

    h1,h2,h3,h3,h4,h5,h6,button {
        font-family: ${({ theme }) => theme.fonts.title};
        margin: 0;
    }

    input, textarea {
        outline: none;
        border: none;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    li {
        list-style: none;
    }

    .appear {
        animation: ${appearAnim} 0.2s linear;
    }
`;

export default GlobalStyle;
