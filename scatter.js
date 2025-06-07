window.scatterChart = (function () {
  const margin = { top: 50, right: 30, bottom: 50, left: 80 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  let svg, tooltip;

  function destroy() {
    if (svg) {
      svg.selectAll("*").remove();
    }
  }

  function init(_svg, _tooltip) {
    tooltip = _tooltip;
    _svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg = _svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.dsv(";", "data.csv", d3.autoType).then(data => {
      const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d["Average Sales per Unit (Thousands - U.S Dollars)"]))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d["2021 Total Units"]))
        .range([height, 0]);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append("g")
        .call(d3.axisLeft(y));

      svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d["Average Sales per Unit (Thousands - U.S Dollars)"]))
        .attr("cy", d => y(d["2021 Total Units"]))
        .attr("r", 6)
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
          tooltip.style("opacity", 1)
            .html(`<strong>${d["Fast-Food Chains"]}</strong><br>Ventas por unidad: $${d["Average Sales per Unit (Thousands - U.S Dollars)"]}K<br>Unidades: ${d["2021 Total Units"]}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Ventas Promedio por Unidad (en miles USD)");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Total de Unidades 2021");
    });
  }

  return {
    init,
    destroy
  };
})();
