import React from 'react';
import styled from 'styled-components';
import Spells from './spells';

const color = {
    bard: '#E052E0',
    cleric: '#EB4747',
    druid: '#60DF20',
    paladin: '#F5D63D',
    ranger: '#2EB82E',
    sorcerer: '#F2800D',
    warlock: '#A852FF',
    wizard: '#4C88FF',
    multiple: '#fff'
}

function gradientize(casters) {
    let gradient = 'conic-gradient(';
    let position = 0;
    let step = 100/casters.length;
    for (let caster of casters) {
        if (position) {
            gradient += ', ';
        }
        gradient += color[caster] + ' ' + position + '% ' + (position += step) + '%';
    }
    gradient += ')';
    return gradient;
}

const Board = styled.div`
    display: grid;
    grid-template-columns: repeat(19, 1fr);
    grid-gap: 0.75vw;
    margin: 0.75vw;
    @media only screen and (min-width: 1280px) {
        width: calc(1280px - 1.5 * 12.8px);
        grid-gap: calc(0.75 * 12.8px);
        margin: calc(0.75 * 12.8px) auto;
    }
`;

function AdditionalCaster(props) {

    return (
        <div className={props.className}></div>
    );
}

const StyledAdditionalCaster = styled(AdditionalCaster)`
    position: absolute;
    width: 1vw;
    height: 1vw;
    border-radius: 50%;
    box-shadow: 0 0 0 3px #222;
    background-color: ${props => color[props.caster]};

    :first-of-type {
        top: 0;
        left: 0;
    }

    :nth-of-type(2) {
        top: 0;
        right: 0;
    }

    @media only screen and (min-width: 1280px) {
        width: 12.8px;
        height: 12.8px;
    }
`;

const CasterLabel = styled.span`
    color: ${props => color[props.caster]};
    text-transform: capitalize;

    :not(:last-of-type) {
        :after {
            content: ', ';
        }
    }
`;

class SpellTooltip extends React.Component {

    renderCasterLabels(casters) {

        return casters.map(caster => <CasterLabel key={caster} caster={caster}>{caster}</CasterLabel>);
    }

    render() {

        return(
            <div className={this.props.className}>
                <h3>{this.props.name}</h3>
                <h4>{this.props.level ? 'LEVEL' + this.props.level : 'CANTRIP'}</h4>
                <p>{this.renderCasterLabels(this.props.casters)}{this.props.additionalCasters.length > 0 ? ' and subclasses of ' : ''}{this.renderCasterLabels(this.props.additionalCasters)}</p>
            </div>
        );
    }
}

const StyledSpellTooltip = styled(SpellTooltip)`
    opacity: 0;
    visibility: hidden;
    display: block;
    position: absolute;
    min-width: 10em;
    top: 110%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background-color: #111;
    color: #aaa;
    font-size: 0.75em;
    line-height: 1.3;
    padding: 0.75em;
    border-radius: 1em;
    transition: box-shadow 0.2s, opacity 0.2s, transform 0.2s;
    box-shadow: 0 0 1em 0 rgba(0,0,0,0.5);
    z-index: 2;

    :before {
        content: '';
        position: absolute;
        left: calc(50% - 10px);
        top: -10px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 10px 10px;
        border-color: transparent transparent #111 transparent;
    }

    h3, h4, p {
        margin: 0;
    }

    h3 {
        color: #fff;
        white-space: nowrap;
    }

    h4 {
        border-bottom: 1px solid #333;
        padding-bottom: 0.5em;
        margin-bottom: 0.25em;
    }
`;

const renderAdditionalCasters = additionalCasters => additionalCasters ?
    additionalCasters.map(additionalCaster => <StyledAdditionalCaster key={additionalCaster} caster={additionalCaster}/>) :
    '';

function Spell(props) {

    return (
        <StyledSpell {...props} className={props.className} onClick={() => props.onClick()}>
            {renderAdditionalCasters(props.additionalCasters)}
            <SpellLevel></SpellLevel>
            <StyledSpellTooltip name={props.name} level={props.level} casters={props.casters} additionalCasters={props.additionalCasters} />
        </StyledSpell>
    );
}

const StyledSpell = styled.div.attrs({
    style: props => ({
        background: props.highlightColors.length ? gradientize(props.highlightColors) : gradientize(props.casters),
        gridColumnStart: props.coordinates[0],
        gridRowStart: props.coordinates[1]
    })
})`
    width: 100%;
    padding-top: 100%;
    border-radius: 50%;
    position: relative;
    ${props => props.selected ? 'box-shadow: 0 0 0 3px #fff;' : ''}
    ${props => props.selected ? 'z-index: 2;' : ''}
    ${props => (props.hasOpacity || props.highlightColors.length || props.selected) ? '' : 'opacity: 0.25;'}
    transition: box-shadow 0.2s, opacity 0.2s;

    :hover {
        ${props => props.selected ? 'box-shadow: 0 0 0 6px #fff;' : 'box-shadow: 0 0 0 3px #222, 0 0 0 6px #fff;'}
        opacity: 1;
        z-index: 2;

        ${StyledSpellTooltip} {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
    }
`;

const SpellLevel = styled.div`
    position: absolute;
    top: calc(50% - 0.75vw);
    left: 0;
    right: 0;
    font-size: 1.5vw;
    line-height: 1.5vw;
    text-align: center;

    @media only screen and (min-width: 1280px) {
        top: calc(50% - 0.75 * 12.8px);
        font-size: calc(1.5 * 12.8px);
        line-height: calc(1.5 * 12.8px);
    }
`;

function SaveButton(props) {

    return <button onClick={() => props.onClick()}>Save</button>;
}

function HighlightButton(props) {

    return <button onClick={() => props.onClick()}>{props.label}</button>;
}

function swap(spells, i1, i2) {

    return spells.map((spell, index) => {
        switch (index) {
            case i1: return {...spell, coordinates: spells[i2].coordinates};
            case i2: return {...spell, coordinates: spells[i1].coordinates};
            default: return spell;
        }
    });
}

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            'spells': [],
            'selectedId': false,
            'highlightedClasses': [],
            'editMode': false,
            'timeSinceLastSave': 0
        };

        var currentKey=0;
        for (currentKey in Spells) {
            this.state.spells[currentKey] = Spells[currentKey];
            //console.log(this.state.spells[currentKey]);
        }

        this.state.selectedId = false;
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if (this.state.editMode) {
            this.setState({
                'timeSinceLastSave': this.state['timeSinceLastSave'] + 1000
            });
            if (this.state['timeSinceLastSave'] > 100000) {
                this.handleSave(this.state.spells);
                this.setState({
                    'timeSinceLastSave': 0
                });
                console.log('Saved');
            }
        }
    }

    handleSave(jsonData) {
        const fileData = JSON.stringify(jsonData);
        const blob = new Blob([fileData], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'filename.json';
        link.href = url;
        link.click();
    }

    handleClick(i) {
        if (this.state.editMode) {
            if (this.state.selectedId === i) {
                this.setState({'selectedId': false});
                console.log('unselected: '+i);
            } else if (this.state.selectedId) {
                console.log('switching position of ' + this.state.selectedId + ' and ' + i);
                const { spells, selectedId } = this.state;
                this.setState({
                    spells: swap(spells, Number(i), Number(selectedId)),
                    selectedId: false
                });
            } else {
                this.setState({'selectedId': i});
                console.log('selected: ' + i);
            }
        }
    }

    handleHighlightClick(caster) {
        if (this.state.highlightedClasses.includes(caster)) {
            /* if the caster was highlighted, we remove it from the highlighted classes */
            //console.log('removing highlight from ' + caster);
            this.setState({
                highlightedClasses: this.state.highlightedClasses.filter(value =>  value !== caster)
            });
        } else {
            /* if the caster was not highlighted, we add it to highlighted classes */
            //console.log('highlighting ' + caster);
            var newHighlightedClasses = this.state.highlightedClasses;
            newHighlightedClasses.push(caster);
            this.setState({
                highlightedClasses: newHighlightedClasses
            });
        }
    }

    getHighlightColors(casters) {

        return casters.filter(value => this.state.highlightedClasses.includes(value));
    }

    renderSpells() {

        return this.state.spells.map(i => <Spell
            key={i.id}
            id={i.id}
            name={i.name}
            casters={i.casters}
            additionalCasters={i.additionalCasters}
            level={i.level}
            selected={this.state.selectedId === i.id ? true : false}
            hasOpacity={this.state.highlightedClasses.length === 0}
            highlightColors={this.getHighlightColors(i.casters)}
            coordinates={i.coordinates}
            onClick={() => this.handleClick(i.id)}
        />);
    }

    render() {

        return (
            <>
                <Board>
                    {this.renderSpells()}
                </Board>
                <SaveButton onClick={() => this.handleSave(this.state.spells)} />
                <HighlightButton onClick={() => this.handleHighlightClick('bard')} label='Highlight Bard' />
                <HighlightButton onClick={() => this.handleHighlightClick('cleric')} label='Highlight Cleric' />
                <HighlightButton onClick={() => this.handleHighlightClick('druid')} label='Highlight Druid' />
                <HighlightButton onClick={() => this.handleHighlightClick('paladin')} label='Highlight Paladin' />
                <HighlightButton onClick={() => this.handleHighlightClick('ranger')} label='Highlight Ranger' />
                <HighlightButton onClick={() => this.handleHighlightClick('sorcerer')} label='Highlight Sorcerer' />
                <HighlightButton onClick={() => this.handleHighlightClick('warlock')} label='Highlight Warlock' />
                <HighlightButton onClick={() => this.handleHighlightClick('wizard')} label='Highlight Wizard' />
                <p>{this.state.editMode ? 'EDIT MODE, AUTOSAVING' : ''}</p>
            </>
        );
    }
}

export default App;
