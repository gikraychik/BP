<?php

require_once 'libraries/Ganon/ganon.php';
setlocale(LC_ALL,'ru_RU.CP1251','ru_RU','rus');

function cp1251_utf_strftime($format, $iTimestamp=0)
{
    if (!$iTimestamp) {
        return iconv("cp1251", "UTF-8", strftime($format));
    }
    else {
        return iconv("cp1251", "UTF-8", strftime($format, $iTimestamp));
    }
}

function generateCalendar($tournamentDates = [], $tournamentTimes = [])
{
    // Get current year, month and day
    list($iNowYear, $iNowMonth, $iNowDay) = explode('-', date('Y-m-d'));

    // Get current year and month depending on possible GET parameters
    if (isset($_GET['month'])) {
        list($iMonth, $iYear) = explode('-', $_GET['month']);
        $iMonth = (int)$iMonth;
        $iYear = (int)$iYear;
    } else {
        list($iMonth, $iYear) = explode('-', date('n-Y'));
    }

    // Get name and number of days of specified month
    $iTimestamp = mktime(0, 0, 0, $iMonth, 1, $iYear);
    $sMonthName = cp1251_utf_strftime('%B', $iTimestamp);
    $iDaysInMonth = (int)date('t', $iTimestamp);

    // Get previous year and month
    $iPrevYear = $iYear;
    $iPrevMonth = $iMonth - 1;
    if ($iPrevMonth <= 0) {
        $iPrevYear--;
        $iPrevMonth = 12; // set to December
    }

    // Get next year and month
    $iNextYear = $iYear;
    $iNextMonth = $iMonth + 1;
    if ($iNextMonth > 12) {
        $iNextYear++;
        $iNextMonth = 1;
    }

    // Get number of days of previous month
    $iPrevDaysInMonth = (int)date('t', mktime(0, 0, 0, $iPrevMonth, 1, $iPrevYear));

    // Get numeric representation of the day of the week of the first day of specified (current) month
    $iFirstDayDow = (int)date('N', $iTimestamp);

    // On what day the previous month begins
    $iPrevShowFrom = $iPrevDaysInMonth - ($iFirstDayDow - 1) + 1;

    // If previous month
    $bPreviousMonth = ($iFirstDayDow > 1);

    // Initial day
    $iCurrentDay = ($bPreviousMonth) ? $iPrevShowFrom : 1;

    $bNextMonth = false;
    $sCalTblRows = '';

    $tournamentsCount = count($tournamentDates);

    // Generate rows for the calendar
    for ($i = 0; $i < 6; $i++) { // 6-weeks range
        $sCalTblRows .= '<tr>';
        for ($j = 0; $j < 7; $j++) { // 7 days a week

            $sClass = $sAClass = '';
            $isTournamentToday = false;
            $iTournament = 0;

            for ($k=0; $k < $tournamentsCount; $k++) { 
                list($tournamentDay, $tournamentMonth, $tournamentYear) = explode(".", $tournamentDates[$k]);
                $isTournamentToday = ($tournamentDay == $iCurrentDay && 
                                    $tournamentMonth == $iMonth &&
                                    $tournamentYear == $iYear);
                if ($isTournamentToday) {
                    $sClass .= 'tournament-date';
                    $sAClass = 'hasTooltip';
                    $iTournament = $k;
                    break;
                }
            }

            if ($j > 4) {
                $sClass .= ' weekend';
            }

            // if ($iNowYear == $iYear && 
            // $iNowMonth == $iMonth && 
            // $iNowDay == $iCurrentDay && 
            // !$bPreviousMonth && !$bNextMonth) {
            //     $sClass .= 'today';
            // }

            if (!$bPreviousMonth && !$bNextMonth) {
                $sClass .= " current";
                $sCalTblRows .= '<td class="'.$sClass.'">
                                        <a href="javascript: void(0)" class="'.$sAClass.'">
                                            <span>'.$iCurrentDay.'</span>
                                        </a>';
                if ($isTournamentToday) {
                    $sCalTblRows .= '   <div class="hidden">
                                            '.$tournamentTimes[$iTournament].'<br>
                                            <span>'.
                                                cp1251_utf_strftime(
                                                    '%d %b %Y', 
                                                    mktime(0, 0, 0, $iMonth, $iCurrentDay, $iYear)
                                                    ).
                                            '</span>
                                            <span id="date" class="hidden">'.
                                                cp1251_utf_strftime(
                                                    '%d.%m.%Y', 
                                                    mktime(0, 0, 0, $iMonth, $iCurrentDay, $iYear)
                                                    ).'
                                            </span>
                                            <br><span>Нажмите на число<br>для регистрации!</span>
                                        </div>';
                }
                $sCalTblRows .= '</td>';
            }
            else {
                $sCalTblRows .= '<td class="outsideMonth"><a href="javascript: void(0)"></a></td>';
            }

            // Next day
            $iCurrentDay++;
            if ($bPreviousMonth && $iCurrentDay > $iPrevDaysInMonth) {
                $bPreviousMonth = false;
                $iCurrentDay = 1;
            }
            if (!$bPreviousMonth && !$bNextMonth && $iCurrentDay > $iDaysInMonth) {
                $bNextMonth = true;
                $iCurrentDay = 1;
            }
        }
        $sCalTblRows .= '</tr>';
    }

    // Prepare replacement keys and generate the calendar
    $aKeys = array(
        '__prev_month__' => "{$iPrevMonth}-{$iPrevYear}",
        '__next_month__' => "{$iNextMonth}-{$iNextYear}",
        '__cal_caption__' => $sMonthName . ', ' . $iYear,
        '__cal_rows__' => $sCalTblRows,
    );

    $sCalendarItself = strtr(Block::get('calendar'), $aKeys);

    return $sCalendarItself;
}

Blog::setParentPageName("night");
$tournaments_raw_data = str_get_dom(Blog::getPosts());
$tournaments_array = $tournaments_raw_data("#post");
$tournaments_count = count($tournaments_array);

$tournaments = array_fill(0, $tournaments_count, "");

$dates_array = [];
$times_array = [];

for ($i = 0; $i < $tournaments_count; $i++) {
    $tournament = $tournaments_array[$i];
    $date = $tournament("#date")[0]->getPlainText();
    $time = $tournament("#time")[0]->getPlainText();
    $team_list = $tournament("#teams-list")[0]->getChild(1)->html();

    $album = $tournament("#link")[0]->getChild(1);
    $album_link = $album->html();
    if (!(bool)$album->href) {
        $album_link = "Ссылка на альбом появится<br>после проведения турнира";
    }

    // remember date for calendar
    $dates_array[] = $date;
    $times_array[] = $time;

    $tournaments[$i] = "<tr class='tournament-row'>
            <td class='date'>$date</td>
            <td class='teams-list'>$team_list</td>
            <td class='link center'>$album_link</td>
        </tr>";
}

if (isset($_SERVER['HTTP_X_PJAX']) && isset($_GET['month'])) {
    echo generateCalendar($dates_array, $times_array);
    return;
}

$page_content = str_get_dom(Site::Content());

$main_content = $page_content("#main")[0]->html();

$teams = $page_content("#teams>div");
$teams_count = count($teams);

$teams_short = array_fill(0, $teams_count, "");
$teams_full = array_fill(0, $teams_count, "");

for ($i = 0; $i < $teams_count; $i++) {
    $team = $teams[$i];
    $name = $team("#name")[0]->html();
    $logo_url = $team("#logo img")[0]->src;
    $people = $team("#team p");
    $people_html = "<ul>";
    foreach ($people as $human) {
        $people_html .= "<li>".$human->getInnerText()."</li>";
    }
    $people_html .= "</ul>";

    $team_index = $i + 1;

    $teams_short[$i] = "<div class='col-md-4 team' id='team$team_index'>
                            <div class='row'>
                                <div class='col-md-12'>
                                    <div class='logo' style='background-image: url($logo_url)'></div>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-md-12 center'>
                                    <span class='name'>$name</span>
                                </div>
                            </div>
                        </div>";

    $teams_full[$i] = "<div class='row team-descr' id='team-descr$team_index'>
                            <div class='col-md-6'>
                                <div class='row'>
                                    <div class='col-md-12'>
                                        <div class='logo' style='background-image: url($logo_url)'></div>
                                    </div>
                                </div>
                                <div class='row'>
                                    <div class='col-md-12 center'>
                                        <span class='name'>$name</span>
                                    </div>
                                </div>
                            </div>
                            <div class='col-md-6 members-list'>
                                <div class='row'>
                                    <div class='col-md-4 list-title'>Состав:</div>
                                    <div class='col-md-8 list-content'>$people_html</div>
                                </div>
                            </div>
                        </div>";
}

?>

<div class="container-fluid content">
	<div class="row">
		<div class="col-md-5 col-md-offset-1">			
				<?php echo $main_content; ?>
		</div>
		<div class="col-md-3">
			<div class="row">
				<div class="col-xs-12">
					<div class="button register-button center" id="register-button">
						<span>Зарегистрироваться</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="wrapper">
						<div class="image-block">
							<?php echo Block::get("night-image"); ?>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-2 col-md-offset-right-1">
			<div class="row">
				<div class="col-xs-12">
					<div class="button circle round-night-button" id="teams-open-button">
						
					</div>
                    <div class="hidden">
                        <span>Список команд</span>
                    </div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="button circle round-night-button" id="calendar-open-button">
						
					</div>
                    <div class="hidden">
                        <span>Календарь турниров</span>
                    </div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="button circle round-night-button" id="archive-open-button">
						
					</div>
                    <div class="hidden">
                        <span>Архив турниров</span>
                    </div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="popup" id="register-form-popup">
    <div class="popup-window register-form">
        <div class="popup-close" id="close"></div>
        <div class="popup-content">
            <form name="order-form" method="POST" action="" id="register-form">
                <input type="hidden" name="form-name" value="register-form">
                <div class="row">
                    <div class="col-xs-12">
                        <label for="name-filed">Название команды:</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <input type="text" name="team" id="team-filed">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 label-register">
                        <label for="name-filed">Имя:</label>
                    </div>
                    <div class="col-xs-6">
                        <input type="text" name="name" id="name-field">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 label-register">
                        <label for="phone-filed">Телефон:</label>
                    </div>
                    <div class="col-xs-6">
                        <input type="tel" name="phone" id="phone-field">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 label-register">
                        <label for="email-filed">Email:</label>
                    </div>
                    <div class="col-xs-6">
                        <input type="email" name="email" id="email-field">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 label-register">
                        <label for="date-filed">Дата турнира:</label>
                    </div>
                    <div class="col-xs-6">
                        <input type="date" name="date" id="date-field">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <button type="submit" class="button register-button">
                            <span>Зарегистрировать</span>
                        </button>
                    </div>
                </div>
                <div id="result" class="result-list"></div>
            </form>
        </div>
    </div>
</div>
<div class="popup" id="teams-popup">
    <div class="popup-window teams">
        <div class="popup-close" id="close"></div>
        <div class="popup-close fake-close" id="fake-close"></div>
        <div class="popup-content">
            <div class="center">
                <h2>Список команд</h2>
            </div>
            <div class="teams-list">
                <?php
                    $teams_count_in_row = 3;

                    echo "<div class='row'>";
                    for ($i = 0; $i < $teams_count; $i++) {
                        echo $teams_short[$i];
                        if (($i+1) % $teams_count_in_row == 0) {
                            echo "</div>";
                            if ($i != $teams_count - 1) {
                                echo "<div class='row'>";
                            }
                        }
                    }
                    if ($teams_count % $teams_count_in_row != 0) {
                        echo "</div>";
                    }
                ?>
            </div>
            <div class="teams-description">
                <?php
                for ($i = 0; $i < $teams_count; $i++) {
                    echo $teams_full[$i];
                }
                ?>
            </div>
        </div>
    </div>
</div>

<div class="popup" id="calendar-popup">
    <div class="popup-window calendar">
        <div class="popup-close" id="close"></div>
        <div class="popup-content">
            <div class="center">
                <h2>Календарь турниров</h2>
            </div>
            <div class="ajax-calendar" id="calendar">
                <?php echo generateCalendar($dates_array, $times_array); ?>
            </div>
        </div>
    </div>
</div>

<div class="popup" id="archive-popup">
    <div class="popup-window archive">
        <div class="popup-close" id="close"></div>
        <div class="popup-content">
            <div class="center">
                <h2>Архив турниров</h2>
            </div>
            <div class="archive-list">
                <table>
                    <tr class="title-row">
                        <td>Дата</td>
                        <td>Список команд</td>
                        <td class="center">Фотоотчет</td>
                    </tr>
                    <?php
                    for ($i = 0; $i < $tournaments_count; $i++) {
                        echo $tournaments[$i];
                    }
                    ?>
                </table>
            </div>
        </div>
    </div>
</div>