<?php
$page_content = new DOMDocument();// Get site content with ignore errors
@$page_content->loadHTML('<?xml encoding="UTF-8">'.Site::Content());// Get fix price per hour
$fix_price = $page_content->getElementsByTagName("fix-price")->item(0)->textContent;// Get sales
$sales_data = $page_content->getElementsByTagName("sale");
$sales_count = $sales_data->length;$names = array_fill(0, $sales_count, "");
$values = array_fill(0, $sales_count, 0);
$descriptions = array_fill(0, $sales_count, "");
$includes = array_fill(0, $sales_count, "");
$excludes = array_fill(0, $sales_count, "");
$ids = array_fill(0, $sales_count, "");for ($i=0; $i < $sales_count; $i++) {
$names[$i] = $sales_data->item($i)->getElementsByTagName("name")->item(0)->textContent;
$values[$i] = (int)$sales_data->item($i)->getElementsByTagName("value")->item(0)->textContent;@$descriptions[$i] = $sales_data->item($i)->getElementsByTagName("description")->item(0)->textContent;
if (!$descriptions[$i]) {
$descriptions[$i] = "";
}
@$excludes[$i] =  $sales_data->item($i)->attributes->getNamedItem("exclude")->nodeValue;
if (!$excludes[$i]) {
$excludes[$i] = "";
}
@$ids[$i] =  $sales_data->item($i)->attributes->getNamedItem("id")->nodeValue;
if (!$ids[$i]) {
$ids[$i] = "";
}
@$includes[$i] =  $sales_data->item($i)->attributes->getNamedItem("include")->nodeValue;
if (!$includes[$i]) {
$includes[$i] = "";
}
}$sales = array(
"name" => $names,
"value" => $values,
"description" => $descriptions,
"include" => $includes,
"exclude" => $excludes,
"id" => $ids);
?><?php
// Function to print sales in rows
function printSales($sales, $sales_count)
{
$COUNT_SALES_IN_ROW = 2;
?>
<div class="col-flexible" id="price-calc" xmlns="http://www.w3.org/1999/html">
<div class="row title-row">
<div class="col-lg-12">
<span class="title">
Собери себе скидку в пределах 30%
</span>
</div>
</div>
<div class="row">
<?php
$iteration_count = (int)($sales_count / $COUNT_SALES_IN_ROW);
if ($sales_count % $COUNT_SALES_IN_ROW != 0){
$iteration_count++;
}
for ($i=0; $i < $COUNT_SALES_IN_ROW; $i++) {
echo "<div class=\"col-xs-6\">";
for ($j=0; $j < $iteration_count; $j++) {
$index = ($i * $iteration_count) + $j ;
if ($index + 1 > $sales_count) {
break;
}
?>
<div class="item"
<?php if ($sales['id'][$index]) {echo "id=\"".$sales['id'][$index]."\"";} ?>
<?php if ($sales['exclude'][$index]) {echo "excludes=\"".$sales['exclude'][$index]."\"";} ?>
<?php if ($sales['include'][$index]) {echo "includes=\"".$sales['include'][$index]."\"";} ?>
>
<span><?php echo $sales['name'][$index] ?></span>
<a class="big circle button <?php if ($sales['description'][$index]) {echo "hasTooltip";} ?>" href="#">
<span>
<span id="sale"><?php echo $sales['value'][$index] ?></span>%
</span>
</a>
<?php
if ($sales['description'][$index]) {
echo "<div class='hidden'>".$sales['description'][$index]."</div>";
}
?>
</div>
<?php
}
echo "</div>";
}
?>
</div>
</div>
<?php
}
?><div class="container-fluid content">
<div id="price-calc-up"></div>
<div class="col-fix">
<div class="row hours-row">
<span class="title">Количество часов: </span><input type="radio" class="css-checkbox" id="radio1" checked="checked" name="hours" value="1" />
<label for="radio1" class="css-label">1</label><input type="radio" class="css-checkbox" id="radio2" name="hours" value="2" />
<label for="radio2" class="css-label">2</label><input type="radio" class="css-checkbox" id="radio3" name="hours" value="3" />
<label for="radio3" class="css-label">3</label>
</div>
<div class="row price-row">
<div class="title">Общая цена заказа за всех участников:</div>
<div class="container-fluid button">
<div class="row">
<div class="col-xs-9">
<span>
<span id="fix-price"><?php echo $fix_price; ?></span> ₽/час
</span>
<span>
x <span id="mult">1</span>
</span>
</div>
<div class="col-xs-3">
<span>
-<span id="sum-sale">0</span>%
</span>
</div>
</div>
<div class="row">
<div class="col-xs-12">
<span>=</span>
</div>
</div>
<div class="row">
<div class="col-xs-12">
<span>
<span id="sum"><?php echo $fix_price; ?></span> ₽
</span>
</div>
</div>
</div>
<div class="info-button circle" id="info-button">
<span>?</span>
</div>
</div>
<div class="row button-row">
<a class="container-fluid button" id="order">
Оформить заказ
</a>
</div>
</div>
<div id="price-calc-down">
<?php printSales($sales, $sales_count) ?>
</div>
</div>
<div class="popup" id="popup">
<div class="popup-window order-form">
<div class="popup-close" id="close"></div>
<div class="popup-content">
<form name="order-form" method="POST" action="" id="order-form">
<input type="hidden" name="form-name" value="order-form">
<div class="row">
<div class="col-xs-1 red">
*
</div>
<div class="col-xs-3">
<label for="name-filed">Ваше имя</label>
</div>
<div class="col-xs-8">
<input type="text" id="name-filed" name="name" >
</div>
</div>
<div class="row">
<div class="col-xs-1 red">
*
</div>
<div class="col-xs-3">
<label for="phone-filed">Телефон</label>
</div>
<div class="col-xs-8">
<input type="tel" id="phone-field" name="phone" >
</div>
</div>
<div class="row">
<div class="col-xs-1">
&nbsp;
</div>
<div class="col-xs-3">
<label for="email-filed">Email</label>
</div>
<div class="col-xs-8">
<input type="email" id="email-field" name="email" >
</div>
</div>
<div class="row">
<div class="col-xs-1">
&nbsp;
</div>
<div class="col-xs-11">
<label for="time-filed">Время и дата игры</label>
<input id="time-field" class="input-time center" type="time" name="time" >
<input id="date-field" class="input-date center" type="date" name="date" >
</div>
</div>
<div class="row">
<div class="col-xs-1">
&nbsp;
</div>
<div class="col-xs-11">
<label for="hours-filed">Количество часов: <span id="mult"></span> ч.</label>
<input id="hours-field" type="hidden" name="hours" >
</div>
</div>
<div class="row">
<div class="col-xs-1">
&nbsp;
</div>
<div class="col-xs-11">
<label for="sale-filed">Суммарная скидка: <span id="sum-sale"></span>%</label>
<input id="sale-field" type="hidden" name="sale" >
<input id="checked-sales-field" type="hidden" name="checked-sales" value="">
</div>
</div>
<div class="row">
<div class="col-xs-1">
&nbsp;
</div>
<div class="col-xs-11">
<label for="sum-filed">Цена заказа: <span id="sum"></span> руб.</label>
<input id="sum-field" type="hidden" name="sum" >
</div>
</div>
<div class="row">
<div class="col-xs-1">
&nbsp;
</div>
<div class="col-xs-11">
<button type="submit" class="form-button">
Отправить заявку!
</button>
</div>
</div>
<div id="result" class="result-list"></div>
</form>
</div>
</div>
</div><div class="popup" id="popup-info">
<div class="popup-window info">
<div class="popup-close" id="close"></div>
<div class="popup-content">
<div class="text">
<span>
Указана цена заказа из расчета на всех участников. Количество участников может варьироваться от 6 до 20 человек. Одновременно "в поле" может присутствовать не более 10 человек (игры проводятся либо 3:3, либо 4:4, либо 5:5 человек).
</span>
</div>
</div>
</div>
</div><div class="popup" id="popup-promo">
<div class="popup-window promo">
<div class="popup-close" id="close"></div>
<div class="popup-content">
<form name="promo-form" method="POST" action="" id="promo-form" >
<input type="hidden" name="form-name" value="promo-form">
<div class="row">
<div class="col-xs-5 promo-col-label">
<label for="promo-filed">Промо код: </label>
</div>
<div class="col-xs-7 promo-col-input">
<input id="promo-field" type="text" name="promo" >
</div>
</div>
<div class="col-xs-12 promo-col-submit">
<button type="submit" class="form-button">
Отправить
</button>
</div>
<div id="result" class="result-list"></div>
</form>
</div>
</div>
</div>