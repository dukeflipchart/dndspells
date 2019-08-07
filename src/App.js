import React from 'react';
import styled from 'styled-components';

var color = {
    bard: 'red',
    wizard: 'purple'
}

function Gradientize(casters) {
    let gradient = 'background: conic-gradient(';
    let position = 0;
    let step = 100/casters.length;
    for (let caster of casters) {
        if (position) {
            gradient += ', ';
        }
        gradient += color[caster] + ' ' + position + '% ' + (position += step) + '%';
    }
    gradient += ');';
    return gradient;
}

const Board = styled.div`
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    grid-column-gap: 1em;
    margin: 1em;
`;

function Spell(props) {
    console.log(props.casters);
    return <div className={props.className}></div>;
}

const StyledSpell = styled(Spell)`
    width: 100%;
    padding-top: 100%;
    border-radius: 50%;
    ${Gradientize(props => props.casters)}
`;

function App() {
    return (
        <Board>
            <StyledSpell casters={['bard']} />
            <StyledSpell casters={['bard', 'wizard']} />
            <StyledSpell casters={['wizard']} />
        </Board>
    );
}

export default App;
