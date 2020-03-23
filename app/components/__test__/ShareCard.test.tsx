import React from 'react';
import nock from 'nock';
import { renderApp } from '../../testUtils';
import ShareCard from '../ShareCard';

describe('ShardCard', () => {
  it('youtube', async () => {
    nock('https://www.youtube.com')
      .get('/embed/youtubeVideoId')
      .reply(200, `
      <script>
        init({"embedded_player_response":"{
          \"embedPreview\":{
            \"thumbnailPreviewRenderer\":{
              \"title\": {
                \"runs\":[{\"text\":\"youtube test title!\"}]
              },
              \"defaultThumbnail\":{
                \"thumbnails\":[
                  {\"url\": \"thumbnails-url\",\"width\":120,\"height\":90},
                  {\"url\": \"http:\/\/thumbnails\/image\/url\",\"width\":320,\"height\":180}
                ]
              }
            }
          }
        }"});
      </script>
      `);
    const { findByText, getByTestId } = renderApp(<ShareCard uri="https://www.youtube.com/embed/youtubeVideoId" />);
    await findByText('youtube test title!');
    getByTestId('thumbnail');
  });

  // it('facebook video', () => {
  //   const html = `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Video</title>
  //         <link href="https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/O2aKM2iSbOw.png" rel="shortcut icon" sizes="196x196" />
  //       </head>
  //       <body tabindex="0" class="bare touch x2 _fzu _50-3 iframe">
  //         <div id="viewport" data-kaios-focus-transparent="1">
  //           <h1 style="display:block;height:0;overflow:hidden;position:absolute;width:0;padding:0">Facebook</h1>
  //           <div id="page" class="">
  //             <div class="_129_" id="header-notices"></div>
  //             <div id="root" role="main" data-sigil="context-layer-root content-pane">
  //               <div id="u_0_0">
  //                 <div class="_53mw" data-store="some-data..." data-sigil="inlineVideo">
  //                   <i class="img _53mz _4s0y" style="background: url(&#039;https\3a //scontent-nrt1-1.xx.fbcdn.net/v/t15.5256-10/cp0/e15/q65/p720x720/72782871_464804550852012_2688839931786166272_n.jpg?_nc_cat\3d 107\26 _nc_ohc\3d gyysKzxrgoUAX_Fz0td\26 _nc_ht\3d scontent-nrt1-1.xx\26 oh\3d 48506920c6fa883bdd832deaa0094a20\26 oe\3d 5EA49C2A&#039;) no-repeat center;background-size:auto 100%;-webkit-background-size:auto 100%;padding-bottom:56.167%;"></i>
  //                   <div class="_1o0y" data-sigil="m-video-play-button playInlineVideo">
  //                     <span style="display:block;height:0;overflow:hidden;position:absolute;width:0;padding:0">View Video (0:55)</span>
  //                     <span class="mfsl fcw"></span>
  //                   </div>
  //                 </div>
  //                 <div class="_4_6w">
  //                   <div class="_4_74">
  //                     <div class="_7om2">
  //                       <div class="_4g34 _4_7d">
  //                         Posted by
  //                         <a class="_4_7b inv" href="https://www.facebook.com/CJCGV/" target="_blank">CGV</a>
  //                       </div>
  //                       <div class="_5s61">
  //                         <a class="_4_7c inv" href="/CJCGV/videos/464106710921796/" target="_blank">
  //                           <i class="img sp_VqK70hMFAFu_2x sx_d8be01"></i>
  //                         </a>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `;
  //   const {} = render(<ShareCard uri="" />);
  // });
});

