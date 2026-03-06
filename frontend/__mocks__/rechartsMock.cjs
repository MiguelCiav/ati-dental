const React = require('react');

const MockComponent = ({ children }) => React.createElement('div', null, children);

module.exports = {
    BarChart: MockComponent,
    Bar: MockComponent,
    LineChart: MockComponent,
    Line: MockComponent,
    XAxis: MockComponent,
    YAxis: MockComponent,
    CartesianGrid: MockComponent,
    Tooltip: MockComponent,
    Legend: MockComponent,
    ResponsiveContainer: MockComponent
};
