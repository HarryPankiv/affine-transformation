import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;

    div {
        margin-right: 20px;
        span {
            display: inline-block;
            min-width: 40px;
        }
    }

    input {
        border: none;
        outline: none;
        border-bottom: 1px solid black;
        margin: 5px;
    }

    

    canvas {
        margin-top: 20px;
        grid-column-start: 2;
        grid-column-end: 4;
    }
`;