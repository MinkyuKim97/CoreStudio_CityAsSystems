---
pagination:
  data: escalators
  size: 1
  alias: item 
permalink: /escalators/{{ item.index}}/
title: "PABT, I remember/No.{{ item.index}}"
layout: base.html
---

<!-- <h1>{{ item.name | default: 'Escalator' }}</h1> -->
<div class="totalBox">

<div class="imageSec">
<img src="/imageFiles/Oct_22nd_000{{item.index}}.png"/>
<!-- {% assign total = pagination.hrefs | size %}
{% assign nextIndex = pagination.pageNumber | plus: 1 | modulo: total %}
{% assign prevIndex = pagination.pageNumber | minus: 1 %}
{% if prevIndex < 0 %}{% assign prevIndex = total | minus: 1 %}{% endif %} -->

<nav class="pager" >
  <!-- <a id="nextBtn" href="{{ pagination.hrefs[nextIndex] }}" data-role="next">Next</a> -->
  <a id="nextBtn" href="{{ pagination.hrefs[pagination.pageNumber | plus: 1] }}" data-role="next">Next</a>
</nav>

</div>

<div class="infoSec">

<div class="descriptionBox">
<p>
No. {{item.index}} came from<strong>{% if item.DirectionFrom == "r"%} Left {%else%} Right {%endif%} side </strong>of the escalator with <strong>{{item.Facial}}</strong> face.

And {% if item.SteadyWalk == "f"%} <strong>walked</strong> on the escalator{% elsif item.SteadyWalk == "t"%} <strong>stood</strong> on the one side of the escalator{% else %}{{item.SteadyWalk}}{%endif%}, <strong>{{item.DistanceFromOthers}} steps</strong> away from others{% if item.Company == 't'%} with a partner{%else%}.{%endif%}

<strong>{% if item.OpenEars == 't'%} Wasn't{%else%}Was{%endif%}</strong> using earphones, and <strong>{% if item.WatchPhone == 'f'%}wasn't{%else%}was{%endif%}</strong> watching a phone.

<strong>{% if item.FollowingRule == 't'%} Was following tacit social rules{%else%}{{item.FollowingRule}}{%endif%}</strong>, and <strong>{% if item.ReadSituation== 't'%}was{%else%}wasn't{%endif%}</strong> tried to be aware of the surrounding situation.

</p>
</div>

<div class="dataBox">
<ul>
  <li><strong>Index:</strong> {{ item.index }}</li>
  <li><strong>Walk-Stand State:</strong> {% if item.SteadyWalk == "f"%}Walk
{% elsif item.SteadyWalk == "t"%}Stand{% else %}{{item.SteadyWalk}}{%endif%}
  </li>
  <li><strong>Facial Expression:</strong> {{item.Facial}}</li>
  <li><strong>Came From:</strong> {% if item.DirectionFrom == "r"%} Left {%else%} Right {%endif%} side</li>
  <li><strong>Distance From Others:</strong> {{ item.DistanceFromOthers }} steps away</li>
  <li><strong>Wearing Earphones:</strong> {% if item.OpenEars == 't' %}TRUE{%else%}FALSE{%endif%}</li>
  <li><strong>Watching Phone:</strong> {% if item.WatchPhone == 't' %}TRUE{%else%}FALSE{%endif%}</li>
  <li><strong>With Partner:</strong> {% if item.Company == 't' %}TRUE{%else%}FALSE{%endif%}</li>
  <li><strong>Following Tacit Social Rules:</strong> {% if item.FollowingRule == 't' %}TRUE{%else%}FALSE{%endif%}</li>
  <li><strong>Be aware of surrounding situation:</strong> {% if item.ReadSituation == 't' %}TRUE{%else%}FALSE{%endif%}</li>
</ul>
</div>
</div>
</div>
