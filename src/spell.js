import React from 'react';
import styled from 'styled-components';

const color = {
    bard: '#E052E0',
    cleric: '#EB4747',
    druid: '#60DF20',
    paladin: '#F5D63D',
    ranger: '#2EB82E',
    sorcerer: '#F2800D',
    warlock: '#A852FF',
    wizard: '#4C88FF'
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

function AdditionalCaster(props) {

    return (
        <div className={props.className}></div>
    );
}

const StyledAdditionalCaster = styled(AdditionalCaster)`
    position: absolute;
    width: 25%;
    height: 25%;
    border-radius: 50%;
    box-shadow: 0 0 0 0.15em #222;
    background-color: ${props => color[props.caster]};

    :first-of-type {
        top: 0;
        left: 0;
    }

    :nth-of-type(2) {
        top: 0;
        right: 0;
    }
`;

export const CasterLabel = styled.span`
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
                <h4>{this.props.level ? 'LEVEL ' + this.props.level : 'CANTRIP'}</h4>
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
    border-radius: 0.5em;
    transition: box-shadow 0.2s, opacity 0.2s, transform 0.2s;
    box-shadow: 0 0 1em 0 rgba(0,0,0,0.5);
    z-index: 2;
    ${props => props.selected ? 'opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0);' : '' }

    :before {
        content: '';
        position: absolute;
        left: calc(50% - 0.5em);
        top: -0.5em;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0.5em 0.5em 0.5em;
        border-color: transparent transparent #111 transparent;
    }

    h3, h4, p {
        margin: 0;
    }

    h3 {
        color: #fff;
        text-transform: uppercase;
        white-space: nowrap;
    }

    h4 {
        border-bottom: 1px solid #333;
        padding-bottom: 0.5em;
        margin-bottom: 0.5em;
    }

    p {
        font-family: 'Merriweather', serif;
        line-height: 1.5;
        text-align: left;
    }
`;

const renderAdditionalCasters = additionalCasters => additionalCasters ?
    additionalCasters.map(additionalCaster => <StyledAdditionalCaster key={additionalCaster} caster={additionalCaster}/>) :
    '';

export function Spell(props) {

    return (
        <StyledSpell {...props} className={props.className} onClick={() => props.onClick()}>
            {renderAdditionalCasters(props.additionalCasters)}
            <SpellLevel></SpellLevel>
            <StyledSpellTooltip name={props.name} level={props.level} casters={props.casters} additionalCasters={props.additionalCasters} selected={props.selected} />
        </StyledSpell>
    );
}

export const StyledSpell = styled.div.attrs({
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
    ${props => props.selected ? 'box-shadow: 0 0 0 0.1em #fff;' : ''}
    ${props => props.selected ? 'z-index: 2;' : ''}
    ${props => (props.hasOpacity || props.highlightColors.length || props.selected) ? '' : 'opacity: 0.25;'}
    transition: box-shadow 0.2s, opacity 0.2s;

    :hover {
        ${props => props.selected ? 'box-shadow: 0 0 0 0.2em #fff;' : 'box-shadow: 0 0 0 0.1em #222, 0 0 0 0.2em #fff;'}
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
