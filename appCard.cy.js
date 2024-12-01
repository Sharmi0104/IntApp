import LoginElements from "../pageObjects/loginPage";
import Elements from "../pageObjects/commonElements";
import HomeElements from "../pageObjects/homePage";
import AppcardElements from "../pageObjects/appCard.js";

const testEmail = require("../../fixtures/testEmail.json");
const testAdNetworkPopup = require("../../fixtures/dataAdnetworkConnectPopup.json");
const testDataAppCard = require("../../fixtures/dataAppCard.json");

let emailAddress =
  testEmail.emailId + Cypress.env("serverId") + Cypress.env("serverDomain");

describe("Validate app card elemnts on Home page", () => {
  const loginElements = new LoginElements();
  const elements = new Elements();
  const homeElements = new HomeElements();
  const appCardElements = new AppcardElements();

  beforeEach(() => {
    // cy.visit("https://staging-my.appvestor.com/");
    cy.visit("https://test-staging-my.appvestor.com/");
    //cy.visit("https://account.appvestor.com/");
    //loginElements.inputEmail().type("newreg1@mailinator.com");
    //loginElements.inputPassword().type("Qwerty123!");
    loginElements.inputEmail().type("SP04@mailinator.com"); // Verified and non verified apps
    //loginElements.inputEmail().type("SP404@mailinator.com"); // only non verified apps
    // loginElements.inputEmail().type("sh121@mailinator.com"); // Only Verified  apps connected
    //loginElements.inputPassword().type("Test123!");
    //loginElements.inputEmail().type("testuser@mailinator.com"); // No apps connected
    loginElements.inputPassword().type("Test123!");
    loginElements.buttonLogIn().click();
  });

  it("Verify app card elements", () => {
    cy.viewport(1300, 2500);
    cy.wait(2000);
    cy.get('[data-qa*="ApplicationListWrapper_div_MainDiv"]').then(
      ($parent) => {
        const elementExists =
          // $parent.find('[class="columns-1 min-[1500px]:columns-2 mb-8"]')
          //   .length > 0;
          $parent.find('[data-qa="ApplicationList_div_appList"]').length > 0;

        if (elementExists === true) {
          appCardElements.verifiedAppCardSection().then(($mainDiv) => {
            appCardElements
              .verifiedAppCardSection()
              .within(($appcard, index) => {
                cy.get($appcard).then(($el) => {
                  appCardElements.appCardItem().each(($noofAppcard) => {
                    const appNameTxt = $noofAppcard
                      .find('[data-qa="ApplicationListItem_h2_AppName"]')
                      .text();
                    if (
                      $el.find(
                        '[data-qa="ApplicationListItemWrapper_div_mainDiv"]'
                      ).length
                    ) {
                      cy.get($noofAppcard)
                        //.find('[data-qa="ApplicationLeadListItem_img_AppIcon"]')//accounts.appvestor
                        .find('[data-qa="ApplicationListItem_img_AppIcon"]')
                        .should("have.attr", "src");
                      cy.get($noofAppcard)
                        .find('[data-qa="ApplicationListItem_h2_AppName"]')
                        .should("have.text", appNameTxt);

                      cy.get($noofAppcard)
                        .find(
                          '[data-qa="ApplicationListItem_button_ViewDashboard"]'
                        )
                        .should("be.visible");
                    }
                  });

                  appCardElements.appCardItem().then(($viewdashboard) => {
                    cy.get($viewdashboard)
                      .eq(0)
                      .find(
                        '[data-qa="ApplicationListItem_button_ViewDashboard"]'
                      )
                      .click({ force: true });
                  });
                });
              });
            elements
              .sideBar()
              .eq(0)
              .within(($sidebaricons) => {
                cy.get($sidebaricons)
                  .children("li")
                  .eq(0)
                  .within(($sidebaruilist) => {
                    cy.get($sidebaruilist).click();
                  });
              });
            var packageName;
            var investablityScore;
            appCardElements
              .appCardItem()
              .eq(1)
              .then(($item) => {
                cy.get($item)
                  .find('[data-qa="ApplicationListItem_p_PackageName"]')
                  .then(($packageNametxt) => {
                    packageName = $packageNametxt.text();
                  });

                //investablity score
                cy.get($item)
                  .find("button")
                  .then(($buttonval) => {
                    investablityScore = $buttonval.text();
                    cy.get($buttonval).click();
                    appCardElements
                      .popupContent()
                      .then(($investablityScore) => {
                        cy.get($investablityScore)
                          .find(
                            '[data-qa="InvestabilityScoreDialog_div_header"]'
                          )
                          .then(($investablityScoreHeader) => {
                            cy.get($investablityScoreHeader)
                              .find("button")
                              .then(($investablityScoreButton) => {
                                cy.get($investablityScoreButton)
                                  .find("span")
                                  .should("have.text", investablityScore);
                              });
                            if (
                              investablityScore ===
                              "Read about investability score here"
                            ) {
                              cy.get($investablityScoreHeader)
                                .find("p")
                                .should(
                                  "have.text",
                                  "Complete the first step to see your investability score and find out how you can make your app investable."
                                );
                              cy.get(
                                '[data-qa="BaseButton_button_BaseButton"]'
                              ).should("have.text", "See first step");
                              cy.get(
                                '[data-qa="BaseButton_button_BaseButton"]'
                              ).click();
                            }
                          });
                      });

                    cy.get($item)
                      .find('[class*="w-full"]')
                      .eq(1)
                      .should("exist");
                  });
                cy.get($item)
                  .find(
                    '[data-qa="ApplicationListItem_p_ReportSdkInstallGuide"]'
                  )
                  .then(($guide) => {
                    cy.get($guide).click({ force: true });
                  });
              });
            //Guide popup
            appCardElements.popupContent().then(($installGuidePopup) => {
              cy.get($installGuidePopup)
                .find('[data-qa="BaseModal_div_ModalLayoutHeader"]')
                .then(($headertxt) => {
                  const popupHeaderText = $headertxt.find("h1").text();

                  if (popupHeaderText === " Let us guide you ") {
                    appCardElements
                      .installationGuideHeader()
                      .should("have.text", testDataAppCard[0].letsGuidePopup);

                    appCardElements
                      .installationGuideSubHeader()
                      .should(
                        "have.text",
                        testDataAppCard[0].installStatsGuideHeader
                      );

                    appCardElements
                      .installationGuideCheckbox()
                      .find('[data-qa="BaseCheckbox_input_Checkbox"]')
                      .then(($checkbox) => {
                        cy.get($checkbox)
                          .should("not.be.checked")
                          .then(($verifyCheck) => {
                            const checkboxValue = $verifyCheck.val();
                            if (checkboxValue === "false") {
                              appCardElements
                                .installStartButton()
                                .should("be.disabled");
                              appCardElements
                                .installStartButton()
                                .should(
                                  "have.text",
                                  testDataAppCard[0].installStatsButtonText
                                );

                              appCardElements
                                .installStatsPopupHeader()
                                .should(
                                  "have.text",
                                  testDataAppCard[0].letsGuidePopupHeader
                                );
                              appCardElements
                                .installStatsPopupHeader()
                                .find("a")
                                .then((link) => {
                                  cy.get(link).click();
                                  cy.request(link.prop("href"))
                                    .its("status")
                                    .should("eq", 200);
                                });
                              cy.get($verifyCheck).check();
                              appCardElements
                                .installStartButton()
                                .should("be.enabled");
                              appCardElements
                                .installStartButton()
                                .click({ force: true });
                            }
                          });
                      });
                  }
                  if (popupHeaderText === " Install Stats SDK - Guide ") {
                    appCardElements
                      .installStatsGuidePopupHeader()
                      .should("have.text", " Install Stats SDK - Guide ");
                    cy.get($installGuidePopup)
                      .find('[data-qa="SdkInstallationSteps_p_AppBundleId"]')
                      .then(($appbundleId) => {
                        const appbundleIdText = $appbundleId.text();

                        cy.get($appbundleId).should("have.text", packageName);
                      });

                    appCardElements
                      .installStatsGuidePDF()
                      .eq(0)
                      .then((link) => {
                        cy.get(link).click();
                        cy.request(link.prop("href"))
                          .its("status")
                          .should("eq", 200);
                      });
                    appCardElements
                      .installStatsGuideBody()
                      .within(($textAndCodeSnippet) => {
                        cy.get(
                          '[data-qa="SdkInstallationSteps_p_GetFirst"]'
                        ).should(
                          "have.text",
                          testDataAppCard[0].installguideFirstPageText
                        );
                        cy.get($textAndCodeSnippet)
                          .find('[data-qa="CodeSnippet_div_MainDiv"]')
                          .eq(0)
                          .then(($codeSnippetText) => {
                            cy.get($codeSnippetText)
                              .find('[class="prism-editor__container"]')
                              .should(
                                "have.text",
                                testDataAppCard[0].codeSnippnetText
                              );
                          });
                        cy.get($textAndCodeSnippet)
                          .find('[data-qa="CodeSnippet_div_MainDiv"]')
                          .eq(1)
                          .then(($codeSnippetText) => {
                            cy.get($codeSnippetText)
                              .find('[class="prism-editor__container"]')
                              .should("be.visible");
                            /*.contains(
                          "def appvestor_stats_version = 'X.Y.Z' implementation ('com.appvestor.android:stats:$appvestor_stats_version')"
                        );*/
                          });
                      });

                    // cy.get('[data-qa="CodeSnippet_div_MainDiv"]');
                    cy.get($headertxt)
                      .find("svg > rect")
                      .then(($toggelbutton) => {
                        cy.get($toggelbutton).eq(1).click();
                      });
                    appCardElements
                      .installStatsGuidePage2()
                      .should(
                        "have.text",
                        testDataAppCard[0].installguideSeconddPageText
                      );
                    cy.get($headertxt)
                      .find("svg > rect")
                      .then(($toggelbutton) => {
                        cy.get($toggelbutton).eq(2).click();
                      });
                    appCardElements
                      .installStatsGuideBody()
                      .within(($txtAndCodeSnippet) => {
                        cy.get($txtAndCodeSnippet)
                          .find('[data-qa="SdkInstallationSteps_p_GetThird"]')
                          .should(
                            "have.text",
                            testDataAppCard[0].installguideThirdPageText
                          );

                        appCardElements
                          .installStatsGuidePage3()
                          .find("a")
                          .eq(0)
                          .then(($popupLink) => {
                            cy.get($popupLink).click();
                            cy.request($popupLink.prop("href"))
                              .its("status")
                              .should("eq", 200);
                          });
                        appCardElements
                          .installStatsGuidePage3()
                          .find("a")
                          .eq(1)
                          .then(($popupLink) => {
                            cy.get($popupLink).click();
                            cy.request($popupLink.prop("href"))
                              .its("status")
                              .should("eq", 200);
                          });
                      });
                    cy.get($headertxt)
                      .find("svg > rect")
                      .then(($toggelbutton) => {
                        cy.get($toggelbutton).eq(3).click();
                      });

                    // Get status of PDF
                    appCardElements
                      .installStatsViewPdfButton()
                      .then(($pdfButton) => {
                        // cy.get($pdfButton)
                        //   .invoke("removeAttr", "target")
                        //   .click();

                        cy.get($pdfButton)
                          .should(
                            "have.text",
                            testDataAppCard[0].viewPDFButtonText
                          )
                          .click();
                        cy.request(
                          "/appvestor_guide_analyticsSDKIntegration-ChA-lLhZ.pdf"
                        )
                          .its("status")
                          .should("eq", 200);
                      });
                    // cy.task(
                    //   "readFile",
                    //   "/appvestor_guide_analyticsSDKIntegration-ChA-lLhZ.pdf"
                    // ).should("contain", "Appvestor SDK Integration Guide");

                    appCardElements.installStatsPopupCloseButton().click();
                  }
                });
            });
          });
        } else {
          cy.log("No app found");
        }
        ///Not verified apps
        const notVerifiedCardExists =
          $parent.find('[class="columns-1 min-[1500px]:columns-2"]').length > 0;

        if (notVerifiedCardExists === true) {
          var notVerifiedPackageName;
          var emailAddress;
          appCardElements
            .notVerifiedAppCardSection()
            .eq(1)
            .within(($notVerifiedappcard, index) => {
              cy.get($notVerifiedappcard)
                .find('[data-qa="ApplicationLeadListItemWrapper_div_mainDiv"]')
                .eq(0)
                .then(($appcard) => {
                  cy.get($notVerifiedappcard)
                    .find('[data-qa="ApplicationLeadListItem_h2_AppName"]')
                    .eq(0)
                    .should("be.visible");

                  cy.get($notVerifiedappcard)
                    .eq(0)
                    .then(($elements) => {
                      cy.get($elements)
                        .find(
                          '[data-qa="ApplicationLeadListItemWrapper_div_TaskList"]'
                        )
                        .then(($singleAppCard) => {
                          cy.get($singleAppCard)
                            .eq(0)
                            .find('[class*="sm:text-left"]')
                            .eq(2)
                            .then(($singleAppCardTxt) => {
                              cy.get($singleAppCardTxt).click({ force: true });
                            });

                          cy.wait(500);
                        });
                    });
                });
            });
          appCardElements
            .notVerifiedAppCardSection()
            .eq(1)
            .find('[data-qa="ApplicationLeadListItem_h2_AppName"]')
            .eq(0)
            .then(($packageName) => {
              notVerifiedPackageName = $packageName.text();
            });
          ///Resend verification popup
          appCardElements.resendVerificationPopupHeader().should("be.visible");
          appCardElements
            .resendVerificationPopupBody()
            .then(($resendVerificationPopup) => {
              cy.get($resendVerificationPopup)
                .find("p")
                .eq(0)
                .should("have.text", notVerifiedPackageName);
              cy.get($resendVerificationPopup)
                .find("p")
                .eq(1)
                .then(($checkEmailaddress) => {
                  cy.get($checkEmailaddress)
                    .find("span")
                    .then(($getEmailaddress) => {
                      emailAddress = $getEmailaddress.text();
                    });
                });
            });
          appCardElements
            .resendVerificationPopupSendButton()
            .should("be.enabled");
          appCardElements.resendVerificationPopupSendButton().click();

          appCardElements.popupContent().then(($OneMoreStepPopup) => {
            cy.get($OneMoreStepPopup)
              .find('[data-qa="ApplicationSendVerifyPost_h1_OneMoreStep"]')
              .should("have.text", testDataAppCard[0].oneMoreStepHeader);
            cy.get($OneMoreStepPopup)
              .find('[data-qa="ApplicationSendVerifyPost_h1_AppsText"]')
              .should(
                "have.text",
                testDataAppCard[0].packnameWithText +
                  notVerifiedPackageName +
                  "."
              );

            cy.get($OneMoreStepPopup)
              .find('[data-qa="ApplicationSendVerifyPost_h1_EmailsText"]')
              .then((emailText) => {
                var txtemail = emailText.text();

                cy.get(emailText).should("have.text", txtemail);
                cy.get(emailText).contains(emailAddress);
              });

            appCardElements.oneMoreStepPopupClosebutton().click();
          });
          // }
          // });
        } else if (notVerifiedCardExists === false) {
          cy.log("No not verified app found");
        }
      }
    );
  });
});
