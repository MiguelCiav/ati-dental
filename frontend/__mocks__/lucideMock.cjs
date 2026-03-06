const React = require('react');
const MockComponent = (props) => React.createElement('div', props);

module.exports = new Proxy({}, {
    get: function (target, prop) {
        if (prop === '__esModule') return true;
        return MockComponent;
    }
});
