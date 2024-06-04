<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="//data">
        <html>
            <head>
                <title>Country Data</title>
                <style>
                    body {
                        font-size: 14pt;
                        font-family: Helvetica, Arial, sans-serif;
                        background-color: #569c9a;
                    }

                    h1 {
                        font-size: 14pt;
                    }

                    select {
                        width: 50%;
                    }

                    tbody {
                        display: inherit;
                        width: 100%;
                    }

                    #table-header {
                        background-color: #009994;
                        color: white;
                    }

                    tr {
                        padding-top: 5pt;
                        padding-bottom: 5pt;
                        width: 100%;
                    }

                    tr:nth-child(even) {
                        background-color: #6abab8;
                    }

                    tr:nth-child(odd) {
                        background-color: #8de0de;
                    }

                    .first-column {
                        width: 8vw;
                    }

                    #content {
                        padding: 3%;
                        border-radius: 10pt;
                        background-color: white;
                        margin-left: 15%;
                        margin-right: 15%;
                    }

                    table {
                        display: inline-block;
                        width: 100%;
                    }

                    th {
                        text-align: start;
                    }

                    th, td {
                        padding-left: 10pt;
                    }
                </style>
            </head>
            <body>
                <div id="content">
                    <div>
                        <strong>Select a Country:</strong><span style="margin-left: 100pt"></span>
                        <select id="country_selector">
                            <xsl:for-each select="record[field[@name='Year']/text()='1990']">
                                <option>
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="field[@name='Country or Area']/text()"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="field[@name='Country or Area']/text()"/>
                                </option>
                            </xsl:for-each>
                        </select>
                    </div>
                    <xsl:for-each select="record[field[@name='Year']/text()='1990']">
                        <h1 style="display: none">
                            <xsl:attribute name="class">
                                <xsl:value-of select="field[@name='Country or Area']/text()"/>
                            </xsl:attribute>
                            <xsl:value-of select="field[@name='Country or Area']/text()"/>
                        </h1>
                    </xsl:for-each>
                    <table>
                        <tr id="table-header" style="display:none">
                            <th class="first-column">Year</th>
                            <th>Population</th>
                        </tr>
                        <xsl:for-each select="record">
                            <tr style="display: none">
                                <xsl:attribute name="class">
                                    <xsl:value-of select="field[@name='Country or Area']/text()"/>
                                </xsl:attribute>
                                <td class="first-column"> 
                                    <xsl:value-of select="field[@name='Year']/text()"/>
                                </td>
                                <td> 
                                    <xsl:value-of select="field[@name='Value']/text()"/>
                                </td>
                            </tr>
                        </xsl:for-each>
                    </table>
                </div>
            </body>
            <script type="text/javascript">
                const country_selector = document.getElementById("country_selector");
                country_selector.addEventListener("change", () => {
                    // Get selected option
                    const selected_country = country_selector.value; 
                    
                    // Hide all table entries except those whose class is 'selected_option'
                    Object.values(document.getElementsByTagName("h1")).forEach(h1 => h1.style.display = "none");
                    Object.values(document.getElementsByTagName("tr")).forEach(tr => tr.style.display = "none");
                    document.getElementById("table-header").style.display = "inherit";
                    Object.values(document.getElementsByClassName(selected_country)).forEach(e => e.style.display = "inherit");
                });
            </script>
        </html>
    </xsl:template>
</xsl:stylesheet>