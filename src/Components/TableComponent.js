import React from "react";
// import TableToExcel from "@stanlystark/table-to-excel";
import convertTZ from ".././ConvertTimeZone";

const arrTypes = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
const fetchUrl = "https://option-chain-app.glitch.me";

class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      expiryDates: [],
      symbols: [],
      selectedDate: "",
      selectedType: arrTypes[0],
      selectedSymbol: "",
      CE: {},
      PE: {},
    };
    this.onSort = this.onSort.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeSymbol = this.changeSymbol.bind(this);
    this.downloadExcel = this.downloadExcel.bind(this);
  }

  fetchData(date, order, type, symbol) {
    date ??= "";
    order ??= "";
    type ??= "";
    symbol ??= "";
    fetch(
      fetchUrl + "/api/data?date=" +
        date +
        "&order=" +
        order +
        "&type=" +
        type +
        "&symbol=" +
        symbol
    )
      .then(function (response) {
        console.log("response" + response);
        return response.json();
      })
      .then((result) => {
        this.setState({
          data: result.data,
          expiryDates: result.expiryDates,
          selectedDate: result.selectedDate,
          selectedType: result.selectedType,
          selectedSymbol: result.selectedSymbol,
          CE: result.CE,
          PE: result.PE,
        });
      })
      .then(() => {
        fetch(fetchUrl + "/api/data/master")
          .then((masterData) => {
            return masterData.json();
          })
          .then((equityData) => {
            this.setState({
              symbols: equityData.data,
            });
          });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  onSort(event) {
    this.fetchData(
      this.state.selectedDate,
      event.target.title,
      this.state.selectedType,
      this.state.selectedSymbol
    );
  }

  changeDate(event) {
    this.fetchData(
      event.target.value,
      null,
      this.state.selectedType,
      this.state.selectedSymbol
    );
  }

  changeType(event) {
    this.fetchData(this.state.selectedDate, null, event.target.value, null);
  }

  changeSymbol(event) {
    this.fetchData(null, null, this.state.selectedType, event.target.value);
  }

  downloadExcel(event) {
    let table = document.querySelector("#option_chain_table");
    // TableToExcel.convert(table, {
    //   name: `${this.state.selectedType || this.state.selectedSymbol} | ${
    //     this.state.selectedDate
    //   } | ${convertTZ(new Date(), "Asia/Kolkata")}.xlsx`,
    // });
  }

  render() {
    const newdata = this.state.data;
    const expiryDates = this.state.expiryDates;
    const symbols = this.state.symbols;
    const selectedDate = this.state.selectedDate;
    const selectedType = this.state.selectedType;
    const selectedSymbol = this.state.selectedSymbol;
    const CE = this.state.CE;
    const PE = this.state.PE;
    return (
      <div>
        <div className="flex-container">
          <div className="flex-child">
            <label>Expiry Date</label>
            <div>
              <select onChange={this.changeDate} value={selectedDate}>
                {expiryDates.map((date) => {
                  return (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex-child">
            <label>Options</label>
            <div>
              <select onChange={this.changeType} value={selectedType}>
                <option> Select Option </option>
                {arrTypes.map((type) => {
                  return (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex-child">
            <label>Symbol</label>
            <div>
              <select onChange={this.changeSymbol} value={selectedSymbol}>
                <option> Select Symbol</option>
                {symbols.map((sym) => {
                  return (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex-child">
            <button onClick={this.downloadExcel}>Download Excel</button>
          </div>
        </div>

        <table id="option_chain_table">
          <thead>
            <tr>
              <th></th>
              <th colSpan="5">CE</th>
              <th colSpan="5">PE</th>
              <th>PCR</th>
            </tr>
            <tr>
              <th title="Strike_Price" onClick={this.onSort}>
                Strike Price
              </th>
              <th title="CALL_OI" onClick={this.onSort}>
                OI
              </th>
              <th title="CALL_OI_CHANGE" onClick={this.onSort}>
                CHANGE IN OI
              </th>
              <th title="CALL_VOL" onClick={this.onSort}>
                VOL
              </th>
              <th title="CALL_IV" onClick={this.onSort}>
                IV
              </th>
              <th title="CALL_LTP" onClick={this.onSort}>
                LTP
              </th>
              <th title="PUT_OI" onClick={this.onSort}>
                OI
              </th>
              <th title="PUT_OI_CHANGE" onClick={this.onSort}>
                CHANGE IN OI
              </th>
              <th title="PUT_VOL" onClick={this.onSort}>
                VOL
              </th>
              <th title="PUT_IV" onClick={this.onSort}>
                IV
              </th>
              <th title="PUT_LTP" onClick={this.onSort}>
                LTP
              </th>
              <th title="PCR" onClick={this.onSort}>
                PCR
              </th>
            </tr>
          </thead>
          <tbody>
            {newdata.map(function (unit, index) {
              return (
                <tr key={index} data-item={unit}>
                  <td>{unit.Strike_Price}</td>
                  <td>{unit.CALL_OI}</td>
                  <td>{unit.CALL_OI_CHANGE}</td>
                  <td>{unit.CALL_VOL}</td>
                  <td>{unit.CALL_IV}</td>
                  <td>{unit.CALL_LTP}</td>
                  <td>{unit.PUT_OI}</td>
                  <td>{unit.PUT_OI_CHANGE}</td>
                  <td>{unit.PUT_VOL}</td>
                  <td>{unit.PUT_IV}</td>
                  <td>{unit.PUT_LTP}</td>
                  <td>{(unit.PUT_OI / unit.CALL_OI).toFixed(3) || 0}</td>
                </tr>
              );
            })}
            <tr>
              <td>Total</td>
              <td>{CE.totOI || 0}</td>
              <td></td>
              <td>{CE.totVol || 0}</td>
              <td></td>
              <td></td>
              <td>{PE.totOI || 0}</td>
              <td></td>
              <td>{PE.totVol || 0}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Ratio</td>
              <td colSpan="5">{(PE.totOI / CE.totOI).toFixed(3) || 0}(OI)</td>
              <td colSpan="5">
                {(PE.totVol / CE.totVol).toFixed(3) || 0}(Volume)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TableComponent;
