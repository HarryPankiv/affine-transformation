import React, { Component } from 'react';

class Canvas extends Component {
    grid = 25;
    scale = 1;
    drawHistory = [];

    getSize(xaxis1, yaxis1, xaxis2, yaxis2) {
        return Math.pow(Math.pow(xaxis2 - xaxis1, 2) + Math.pow(yaxis2 - yaxis1, 2), 0.5) / Math.pow(2, 0.5);
    }

    drawHorizontalGrid() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#e9e9e9';

        let xpos = 0;
        let ypos = 0;

        for (let i = 0; i < this.width / this.grid / this.scale; i++) {
            this.ctx.moveTo(xpos, ypos);
            this.ctx.lineTo(this.width / this.scale, ypos);
            ypos += 25;
            this.ctx.moveTo(xpos, ypos);
        }
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawVerticalGrid() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#e9e9e9';

        let xpos = 0;
        let ypos = 0;

        for (let i = 0; i < this.height / this.grid / this.scale; i++) {
            this.ctx.moveTo(xpos, ypos);
            this.ctx.lineTo(xpos, this.height / this.scale);
            xpos += 25;
            this.ctx.moveTo(xpos, ypos);
        }

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawX() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000000';
        this.ctx.moveTo(0, this.height / 2 / this.scale);
        this.ctx.lineTo(this.width / this.scale, this.height / 2 / this.scale);

        let xpos = 0;
        let ypos = this.height / 2 / this.scale;

        let minusNumber = this.height / this.grid / this.scale / -2;
        for (let i = minusNumber; i < this.width / this.grid / this.scale; i++) {
            this.ctx.font = '9px Arial';
            this.ctx.textAlign = 'end';
            this.ctx.fillText(i, xpos + 2, ypos + 10);

            xpos += 25;
            this.ctx.moveTo(xpos, ypos);
        }

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawY() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000000';
        this.ctx.moveTo(this.width / 2 / this.scale, 0);
        this.ctx.lineTo(this.width / 2 / this.scale, this.height / this.scale);

        let xpos = this.width / 2 / this.scale;
        let ypos = this.height / this.scale;

        let minusNumber = this.height / this.grid / this.scale / -2;
        for (let i = minusNumber; i < this.height / this.grid / this.scale; i++) {
            this.ctx.font = '9px Arial';
            this.ctx.textAlign = 'end';
            this.ctx.fillText(i, xpos + 12, ypos + 2);

            ypos -= 25;
            this.ctx.moveTo(xpos, ypos);
        }

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    scaleUp() {
        this.clear();
        this.ctx.scale(2, 2);
        this.scale *= 2;
        this.drawGrid();
        let drawHistory = this.drawHistory.slice();
        this.clearHistory();
        if (drawHistory.length > 0) {
            drawHistory.map(el => this.drawRect(el));
        }
    }

    scaleDown() {
        this.clear();
        this.ctx.scale(0.5, 0.5);
        this.scale *= 0.5;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
        this.drawGrid();
        let drawHistory = this.drawHistory.slice();
        this.clearHistory();
        if (drawHistory.length > 0) {
            drawHistory.map(el => this.drawRect(el));
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = '#e9e9e9';
        this.drawHorizontalGrid();
        this.drawVerticalGrid();
        this.drawX();
        this.drawY();
        this.ctx.restore();
    }

    clearHistory() {
        this.drawHistory = [];
    }

    drawRect(data) {
        let { xaxis1, xaxis2, yaxis1, yaxis2, angle, color } = data;
        this.drawHistory.push({ xaxis1, xaxis2, yaxis1, yaxis2, angle, color });
        xaxis1 = xaxis1 * this.grid;
        xaxis2 = xaxis2 * this.grid;
        yaxis1 = yaxis1 * this.grid;
        yaxis2 = yaxis2 * this.grid;
        let size = this.getSize(xaxis1, yaxis1, xaxis2, yaxis2);
        var radius = size / 2;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = '2.5';
        // this.ctx.transform(1, 0, 0, -1, 0, this.height);
        this.ctx.translate(this.width / 2 / this.scale, this.height / 2 / this.scale);
        this.ctx.moveTo(0, 0);
        this.ctx.translate(xaxis1 + size / 2, -(yaxis1 - size / 2));
        this.ctx.rotate((angle * Math.PI) / 180);
        this.ctx.rect(-size / 2, size / 2, size, -size);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.strokeStyle = '#3d3d3d';
        this.ctx.lineWidth = '1';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
        this.ctx.stroke();

        this.drawHorizontalLines(size);
        this.drawVerticalLines(size);

        this.ctx.restore();
        this.ctx.restore();
    }

    drawHorizontalLines(size) {
        this.ctx.beginPath();
        let xpos = -size / 2;
        let ypos = -size / 2;

        for (let i = 0; i < size / 25; i++) {
            this.ctx.moveTo(xpos, ypos);
            this.ctx.lineTo(xpos + size, ypos);
            ypos += 25;
            this.ctx.moveTo(xpos, ypos);
        }

        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawVerticalLines(size) {
        this.ctx.beginPath();
        let xpos = -size / 2;
        let ypos = -size / 2;

        for (let i = 0; i < size / 25; i++) {
            this.ctx.moveTo(xpos, ypos);
            this.ctx.lineTo(xpos, ypos + size);
            xpos += 25;
            this.ctx.moveTo(xpos, ypos);
        }

        this.ctx.stroke();
        this.ctx.closePath();
    }
}

export default Canvas;