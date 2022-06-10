module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
          "ie": "10"
        },
        "useBuiltIns": "entry",
        "corejs": "3.6.5",
        "modules": false
      }
    ]
  ],
  "plugins": [
    "transform-remove-console"
  ]
}