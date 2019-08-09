import React from 'react';
import styled from 'styled-components';

var color = {
    bard: 'red',
    wizard: 'purple',
    cleric: 'blue'
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
    grid-column-gap: 0.5vw;
    grid-row-gap: 0.5vw;
    margin: 0.5vw;
`;

function Spell(props) {
    return <div className={props.className}></div>;
}

const StyledSpell = styled(Spell)`
    width: 100%;
    padding-top: 100%;
    border-radius: 50%;
    ${props => Gradientize(props.casters)}
    ${props => props.coordinates ? 'grid-column-start: ' + props.coordinates[0] + ';' : ''}
    ${props => props.coordinates ? 'grid-row-start: ' + props.coordinates[1] + ';' : ''}
`;

function App() {
    return (
        <Board>
            <StyledSpell casters={['bard']} />
            <StyledSpell casters={['bard', 'wizard', 'cleric']} coordinates={[19, 2]} />
            <StyledSpell casters={['wizard']} />
        </Board>
    );
}

export default App;
