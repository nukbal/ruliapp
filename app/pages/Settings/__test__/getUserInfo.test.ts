import nock from 'nock';
import getUserInfo from '../getUserInfo';

describe('get user info', () => {
  it ('parser', async () => {
    nock('https://bbs.ruliweb.com')
      .get('/member/mypage')
      .reply(200, html);
    const data = await getUserInfo();
    expect(data).toEqual({
      id: '99999',
      name: '테스트유저',
      level: 54,
      avatar: 'http://some.ruliweb.avatar.path',
      attends: 111,
      expNow: '12',
      expLeft: '987',
  
      postCount: 111,
      postDelCount: 222,
      commentCount: 333,
      commentDelCount: 444,
      likeCount: 555,
    });
  })

  it('not logined', () => {
    nock('https://bbs.ruliweb.com')
      .get('/member/mypage')
      .reply(302, '');
    expect(getUserInfo()).resolves.toThrowError();
  })
})


const html = `
<div id="mypage" class="cont_profile main_content_area">
    <div class="mypage_subject header_area">
        <h3 class="title">루리웹 정보</h3>
        <span class="desc">| 루리웹 회원정보 및 마크수정이 가능합니다.</span>
        <div class="clear"></div>
    </div>
    <div class="main_area">
        <div class="left_area">
            <div class="left_area_top">
                <div class="profile">
                    <h4 class="title">사용자 정보</h4>
                                            <img class="profile_img" width="88" height="88" src="http://some.ruliweb.avatar.path">
                                            <div class="profile_info">
                        <p class="nick_name"><span class="info_subject none">닉네임</span> <span class="info_value text_over">테스트유저</span><span class="info_value_suffix">님</span><br><span>정회원</span></p>

                                                    <p class="member_srl"><span class="info_subject">루리웹ID</span><span class="info_value text_over">TESTUSER</span></p>
                                                <p class="member_srl"><span class="info_subject">회원번호</span><span class="info_value text_over">99999</span></p>
                        <p class="level"><span class="info_subject">레벨</span> <span class="info_value">54</span></p>
                        <p class="exp"><span class="info_subject">레벨Exp.</span> <span class="info_value">12</span><span class="info_value_suffix">%</span></p>
                        <p class="exp"><span class="info_subject">필요Exp.</span> <span class="info_value">987</span></p>
                        <p class="attend"><span class="info_subject">출석</span> <span class="info_value">111</span><span class="info_value_suffix">일</span></p>
                    </div>
                    <div class="clear"></div>
                </div>
                <table class="user_activity">
                    <tbody>
                    <tr>
                        <td class="activity_container" colspan="3"><h4 class="title">활동내역</h4></td>
                    </tr>
                    <tr>
                        <td class="activity_container">
                            <ul class="list">
                                <li class="list_item frist">
                                    <p class="activity_subject">
                                        <a href="/member/mypage/myarticle">작성 게시글</a></p>
                                    <p class="activity_value_container">
                                        <strong class="activity_value">111</strong>
                                        <span class="activity_value_suffix">개</span>
                                    </p>
                                </li>
                                <div class="clear"></div>
                                <li class="list_item">
                                    <p class="activity_subject">삭제 게시글</p>
                                    <p class="activity_value_container">
                                        <strong class="activity_value">222</strong>
                                        <span class="activity_value_suffix">개</span>
                                    </p>
                                </li>
                            </ul>
                        </td>
                        <td class="activity_container">
                            <ul class="list">
                                <li class="list_item frist">
                                    <p class="activity_subject"><a href="/member/mypage/mycomment">작성 댓글</a></p>
                                    <p class="activity_value_container">
                                        <strong class="activity_value">333</strong>
                                        <span class="activity_value_suffix">개</span>
                                    </p>
                                </li>
                                <div class="clear"></div>
                                <li class="list_item">
                                    <p class="activity_subject">삭제 댓글</p>
                                    <p class="activity_value_container">
                                        <strong class="activity_value">444</strong>
                                        <span class="activity_value_suffix">개</span>
                                    </p>
                                </li>
                            </ul>
                        </td>
                        <td class="activity_container">
                            <ul class="list lst">
                                <li class="list_item frist">
                                    <p class="activity_subject">받은 추천수</p>
                                    <p class="activity_value_container">
                                        <strong class="activity_value">555</strong>
                                        <span class="activity_value_suffix">개</span>
                                    </p>
                                </li>
                                <li class="list_item">
                                </li>
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="left_area_mid">
                <div class="user_link">
                    <h4 class="none">사용자 바로가기</h4>
                    <ul class="list">
                        <li class="list_item frist user_setting">
                            <i class="link_icon icon-large icon-male" style="font-size: 14px;"></i>
                            <a class="link_text" href="/member/mypage/modify_profile">프로필 수정</a>
                        </li>
                                                    <li class="list_item user_setting">
                                <i class="link_icon icon-large icon-cog" style="font-size: 14px;"></i>
                                <a class="link_text" href="https://user.ruliweb.com/member/mypage/modify_info">개인정보 수정</a>
                            </li>
                                                    <li class="list_item message">
                            <i class="link_icon icon-large icon-envelope"></i>
                            <a class="link_text" href="/member/mypage/message">쪽지함</a> <strong><a href="#" class="link_value">0</a></strong>
                        </li>
                        <li class="list_item mypi">
                            <i class="link_icon icon-large icon-folder-close" style="font-size: 14px;"></i>
                            <a class="link_text" href="/member/mypage/myarticle" class="link_txt">MY 게시글</a>
                        </li>
                        <li class="list_item mypi">
                            <i class="link_icon icon-large icon-folder-close" style="font-size: 14px;"></i>
                            <a class="link_text" href="/member/mypage/mycomment" class="link_txt">MY 댓글</a>
                        </li>
                        <li class="list_item mypi">
                            <i class="link_icon icon-large icon-smile" style="font-size: 14px;"></i>
                            <a class="link_text" href="https://mypi.ruliweb.com/mypi.htm?nid=99999" class="link_txt">MY 마이피</a>
                        </li>
                        <li class="list_item mypi">
                            <i class="link_icon icon-large icon-smile" style="font-size: 14px;"></i>
                            <a class="link_text" href="//mypi.ruliweb.com/mypi_admin.htm?nid=99999" target="myadmin">마이피 관리</a>
                        </li>
                        <li class="list_item bookmark">
                            <i class="link_icon icon-large icon-star" style="font-size: 14px;"></i>
                            <a class="link_text" href="/member/mypage/favorites" class="link_txt">즐겨찾기</a>
                        </li>
                        <li class="list_item scrap">
                            <i class="link_icon icon-large icon-download-alt"></i>
                            <a class="link_text" href="/member/mypage/scrap" class="link_txt">스크랩</a>
                        </li>
                        <li class="list_item">
                            <i class="link_icon icon-large icon-archive"></i>
                            <a class="link_text" href="/member/mypage/comment_icon_setting" class="link_txt">댓글아이콘 설정</a>
                        </li>
                        <li class="list_item note">
                            <i class="link_icon icon-large icon-tasks"></i>
                            <a class="link_text" href="/member/mypage/achievement">업적(BETA)</a>
                        </li>
                                                    <li class="list_item scrap">
                                <i class="link_icon icon-large icon-eye-open"></i>
                                <a class="link_text" href="https://user.ruliweb.com/kcp" class="link_txt">성인인증</a>
                            </li>
                                                <li class="list_item note">
                            <i class="link_icon icon-large icon-bell-alt"></i>
                            <a class="link_text" href="/member/mypage/notifylist">알람 목록</a>
                        </li>
                        <li class="list_item note">
                            <div class="link_icon">
                                <i class="icon_mix_front icon-large icon-wrench"></i><i class="icon_mix_back icon-bell-alt"></i>
                            </div>
                            <a class="link_text" href="/member/mypage/notifyconfig">알람 설정</a>
                        </li>
                        <li class="list_item note">
                            <i class="link_icon icon-large icon-minus-sign"></i>
                            <a class="link_text" href="/member/mypage/block">차단 관리</a>
                        </li>
                      <li class="list_item note">
                        <i class="link_icon icon-large icon-wrench"></i>
                        <a class="link_text" href="/member/mypage/session">로그인 관리</a>
                      </li>
                        <li class="list_item note">
                            <i class="link_icon icon-large icon-minus-sign"></i>
                            <a class="link_text" href="https://user.ruliweb.com/member/mypage/leave">회원 탈퇴</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="sub_page center_area">
            <div class="center_area_top">
	<h5 class="sub_page_title">루리웹 프로필 수정</h5>
	<br>
</div>
        </div>
        <div class="clear"></div>
    </div>
</div>
`;
