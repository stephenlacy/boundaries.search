import React, { PureComponent } from 'react'
import fuzzysort from 'fuzzysort'
import { FaArrowCircleRight } from 'react-icons/fa'
import { WanderingCubes } from 'better-react-spinkit'

import './style.sass'

interface State {
  data: []
  results: []
  search: string
  loading: boolean
  error: boolean
}

export default class App extends PureComponent {
  state: State = {
    loading: true,
    error: false,
    data: [],
    results: [],
    search: ''
  }
  componentDidMount = () => {
    fetch('https://raw.githubusercontent.com/stevelacy/boundaries.search/master/list.json')
      .then((res) => res.json())
      .then((data) =>
        this.setState({ data, loading: false })
      )
      .catch((error) => this.setState({ error, loading: false }))
  }
  onSearch = (e: any) => {
    const results = fuzzysort.go(e.target.value, this.state.data, {
      keys: [ 'name', 'id', 'tag' ],
      allowTypo: false,
      threshold: -1000
    })
    this.setState({
      search: e.target.value,
      results: results.slice(0, 10)
    })
  }
  getPath = (id: string): string => {
    return `https://github.com/staeco/boundaries/blob/master/files/${id}.geojson`
  }
  renderResult = (result: Fuzzysort.KeyResult<any>) => {
    return <div key={result.obj.id} className="result">
      <a href={this.getPath(result.obj.id)} target="_blank">
        <div className="rows">
          <div className="row">
            {result.obj.name}
          </div>
          <div className="row">
            {result.obj.id}
          </div>
          <div className="row">
            {result.obj.tag}
          </div>
        </div>
        <div className="icon">
          <FaArrowCircleRight size={24} />
        </div>
      </a>
    </div>
  }
  renderLoader = () => {
    return <div className="loader">
      <WanderingCubes size={150} color='white' />
      Loading boundary files...
    </div>
  }
  renderError = () => {
    return <div className="error">
      Error loading GeoJson list
    </div>
  }
  render = () => {
    if (this.state.loading) return this.renderLoader()
    return <div className="app">
      <img className="logo" src="https://raw.githubusercontent.com/staeco/boundaries/master/logos/white.png" />
      <input
        className="input"
        placeholder="search boundaries (nyc, new york, etc...)"
        type="text"
        value={this.state.search}
        onChange={this.onSearch} />
      {this.state.results.map(this.renderResult)}
      {this.state.error && this.renderError()}
    </div>
  }
}
