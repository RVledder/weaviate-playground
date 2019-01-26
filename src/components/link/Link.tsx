import React from 'react';

/**
 * Types
 */
export interface ILink {
  className: string;
  d: string;
  markerId: string;
  mouseCursor: string;
  opacity: number;
  stroke: string;
  strokeWidth: number;
  source: any;
  target: any;
  value: string;
  onClickLink(source: any, target: any): void;
  onMouseOutLink(source: any, target: any): void;
  onMouseOverLink(source: any, target: any): void;
}

/**
 * Component
 */
export default class Link extends React.Component<ILink> {
  public handleOnClickLink = () =>
    this.props.onClickLink(this.props.source, this.props.target);

  public handleOnMouseOverLink = () =>
    this.props.onMouseOverLink(this.props.source, this.props.target);

  public handleOnMouseOutLink = () =>
    this.props.onMouseOutLink(this.props.source, this.props.target);

  public render() {
    const {
      className,
      d,
      markerId,
      mouseCursor,
      opacity,
      stroke,
      strokeWidth,
      source,
      target,
      value
    } = this.props;
    const markerWidth = 200;
    const markerHeight = 60;
    const fontSize = 30;

    const lineStyle = {
      cursor: mouseCursor,
      fill: 'none',
      opacity,
      stroke,
      strokeWidth
    };

    const rectStyle = {
      cursor: mouseCursor,
      fill: 'white',
      opacity,
      stroke,
      strokeWidth
    };

    const randomId = `${source}-${target}`;

    const lineProps: any = {
      className,
      d,
      markerMid: `url(#${randomId})`,
      onClick: this.handleOnClickLink,
      onMouseOut: this.handleOnMouseOutLink,
      onMouseOver: this.handleOnMouseOverLink,
      style: lineStyle
    };

    if (markerId) {
      lineProps.markerEnd = `url(#${markerId})`;
    }

    return (
      <React.Fragment>
        <defs>
          <marker
            id={randomId}
            viewBox={`0 0 ${markerHeight} ${markerWidth}`}
            refX={markerWidth / 2}
            refY={markerHeight / 2}
            markerWidth={markerWidth}
            markerHeight={markerHeight}
          >
            <rect
              x={strokeWidth}
              y={strokeWidth}
              width={markerWidth - 2 * strokeWidth}
              height={markerHeight - 2 * strokeWidth}
              rx="10"
              ry="10"
              style={rectStyle}
            />
            <text
              x={fontSize * 2}
              y={(markerHeight - fontSize) / 3 + fontSize}
              width={markerWidth - 2 * strokeWidth}
              height={markerHeight - 2 * strokeWidth}
              fontFamily="Alegreya Sans"
              fontWeight="bold"
              fontSize={fontSize}
              fill="black"
            >
              {value || 'Unkown link'}
            </text>
          </marker>
        </defs>
        <path {...lineProps} />
      </React.Fragment>
    );
  }
}
