import React from 'react';
import Canvas from './Canvas';
import { rotate, compose, applyToPoints, translate } from 'transformation-matrix';
import { Wrapper } from './Styled';

class App extends Canvas {
	matrix = [];
	constructor(props) {
		super(props);

		this.state = {
			line: Line,
			offset: 0,
			trapezoid: Trapezoid
		};
	}

	handleInputChange = e => {
		const { trapezoid, line } = this.state;
		const name = e.target.name;
		const value = e.target.value;

		let result;
		if (Object.keys(trapezoid).includes(name)) {
			result = Object.assign(trapezoid, {});
			result[name] = value;
		} else {
			result = Object.assign(line, {});
			result[name] = value;
		}

		this.setState(result);
	};

	componentDidMount = () => {
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		this.ctx = ctx;
		this.height = canvas.height;
		this.width = canvas.width;

		this.drawGrid();
		this.draw();
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevState !== this.state) {
			this.draw();
		}
	};

	draw = () => {
		const { trapezoid, line } = this.state;
		let points = [];
		let i = 0;
		let current;
		for (let item in trapezoid) {
			if (i % 2 === 0) current = trapezoid[item];
			if (i % 2 === 1) points.push({ x: current, y: trapezoid[item] });
			i++;
		}

		this.clear();
		this.drawGrid();

		let res =
			Math.abs(
				Math.abs(Math.abs(points[0].x) + Math.abs(points[1].x)) -
					Math.abs(Math.abs(points[2].x) + Math.abs(points[3].x))
			) / 2;

		let matrix = compose(
			rotate(Math.PI + Math.atan(line.a / line.b)),
			translate(-line.c / line.b, -line.c / line.b + (Math.abs(points[0].y) + Math.abs(points[2].y) - res * 3))
		);

		let lineMatrix = compose(
			rotate(Math.PI + Math.atan(line.a / line.b)),
			translate(-line.c / line.b, -line.c / line.b)
		);

		const lineCords = [{ x: -15, y: 0 }, { x: 15, y: 0 }];
		const lineResult = applyToPoints(lineMatrix, lineCords);

		this.drawLine(lineResult);

		const result = applyToPoints(matrix, points);
		this.drawTrapezoid(result);
		this.drawTrapezoid(
			applyToPoints(
				compose(
					rotate(Math.atan(line.a / line.b)),
					translate(line.c / line.b, line.c / line.b - (Math.abs(points[0].y) + Math.abs(points[2].y)) / 2)
				),
				points
			)
		);

		this.matrix = [
			[matrix.a.toFixed(2), matrix.b.toFixed(2), matrix.e.toFixed(2)],
			[matrix.c.toFixed(2), matrix.d.toFixed(2), matrix.f.toFixed(2)],
			[(0).toFixed(2), (0).toFixed(2), (1).toFixed(2)]
		];
		this.forceUpdate()
	};

	drawTrapezoid(result) {
		this.ctx.save();
		this.ctx.transform(1, 0, 0, -1, 0, this.height);
		this.ctx.translate(this.height / 2, this.width / 2);
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.moveTo(result[0].x * 25, result[0].y * 25);
		this.ctx.lineTo(result[1].x * 25, result[1].y * 25);
		this.ctx.lineTo(result[3].x * 25, result[3].y * 25);
		this.ctx.lineTo(result[2].x * 25, result[2].y * 25);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();
	}

	drawLine = result => {
		this.ctx.save();
		this.ctx.transform(1, 0, 0, -1, 0, this.height);
		this.ctx.translate(this.height / 2, this.width / 2);
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.moveTo(result[0].x * 25, result[0].y * 25);
		this.ctx.lineTo(result[1].x * 25, result[1].y * 25);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();
	};

	render() {
		const { line, offset, trapezoid, matrixForPrint } = this.state;

		return (
			<Wrapper>
				<div>
					<div className="line">
						<h4>Line</h4>
						{Object.keys(line).map(el => (
							<div className="line-item">
								<span>{el}: </span>
								<input type="number" name={el} value={line[el]} onChange={this.handleInputChange} />
							</div>
						))}
					</div>
					<div style={{ marginTop: '10px' }}>
						{line.a}x + {line.b}y + {line.c} = 0
					</div>

					<div className="trapezoid">
						<h4>Trapezoid</h4>
						{Object.keys(trapezoid).map(el => (
							<div className="trapezoid-item">
								<span>{el}: </span>
								<input
									type="number"
									name={el}
									value={trapezoid[el]}
									onChange={this.handleInputChange}
								/>
							</div>
						))}
					</div>

					{/* <div>
						<span>random: </span>
						<input type="range" name="offset" min={-250} max={250} value={offset} onChange={this.handleInputChange} />
					</div> */}

					<h4>Transformation matrix</h4>
					{this.matrix.map((el) => (
						<div>{el[0]}, {el[1]}, {el[2]}</div>
					))}
				</div>
				<canvas id="canvas" height="600" width="600">
					this browser doens't support this
				</canvas>
			</Wrapper>
		);
	}
}

export default App;

const Trapezoid = {
	x1: '-1',
	y1: '1',
	x2: '1',
	y2: '1',
	x3: '-2',
	y3: '-1',
	x4: '2',
	y4: '-1'
};

const Line = {
	a: '1',
	b: '1',
	c: '0'
};
