<?php

function parse_date(string $date): string
{
    $date = trim($date);
    $ymd = explode(" ", $date, 2);
    $arrYMD = explode("-", $ymd[0], 3);
    $day = $arrYMD[0];
    $month = $arrYMD[1];
    $year = $arrYMD[2];
    $newdate = implode("-", [$year, $month, $day]);
    return $newdate . " " . $ymd[1];
}
