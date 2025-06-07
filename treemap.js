window.treemapChart = (function () {
  const width = 900;
  const height = 600;
  let svg, tooltip;

  // Para limpiar elementos cuando se cambia de gráfico
  function destroy() {
    if (svg) {
      svg.selectAll("*").remove();
    }
  }

  function init(_svg, _tooltip) {
    svg = _svg.attr("width", width).attr("height", height);
    tooltip = _tooltip;

    d3.dsv(";", "data.csv", d3.autoType).then(data => {
      const top = data
        .sort((a, b) =>
          b["U.S. Systemwide Sales (Millions - U.S Dollars)"] -
          a["U.S. Systemwide Sales (Millions - U.S Dollars)"]
        )
        .slice(0, 20);

      const root = d3.hierarchy({ children: top })
        .sum(d => d["U.S. Systemwide Sales (Millions - U.S Dollars)"]);

      d3.treemap()
        .size([width, height])
        .padding(2)(root);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      svg.selectAll("rect")
        .data(root.leaves())
        .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => color(d.data["Fast-Food Chains"]))
        .on("mouseover", function (event, d) {
          tooltip.style("opacity", 1)
            .html(`<strong>${d.data["Fast-Food Chains"]}</strong><br>Ventas: $${d.data["U.S. Systemwide Sales (Millions - U.S Dollars)"]}M`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));

      svg.selectAll("text")
        .data(root.leaves())
        .enter().append("text")
        .attr("x", d => d.x0 + 4)
        .attr("y", d => d.y0 + 14)
        .text(d => d.data["Fast-Food Chains"])
        .attr("font-size", "12px")
        .attr("fill", "white")
        .attr("pointer-events", "none");
    });
  }

  return {
    init,
    destroy
  };
})();
