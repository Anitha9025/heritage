# map_module.py

import plotly.express as px
import pandas as pd

def show_location_on_map(lat, lon, site_name):
    df = pd.DataFrame({
        "Site": [site_name],
        "Latitude": [lat],
        "Longitude": [lon]
    })

    fig = px.scatter_mapbox(
        df,
        lat="Latitude",
        lon="Longitude",
        hover_name="Site",
        zoom=12,
        size_max=15,
        mapbox_style="open-street-map"
    )

    fig.update_layout(
        title=f"Map Location: {site_name}",
        margin={"r": 0, "t": 30, "l": 0, "b": 0},
        height=600,
        width=800
    )

    file_name = f"map_{site_name.replace(' ', '_').lower()}.html"
    fig.write_html(file_name)
    print(f"✅ Map saved to {file_name}")
    return file_name
