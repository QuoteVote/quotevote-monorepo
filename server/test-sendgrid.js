import { testSendGridConnection } from './app/data/utils/send-grid-mail.js'

/**
 * Test script to troubleshoot SendGrid configuration
 * Run this with: node test-sendgrid.js
 */
async function testSendGrid() {
  console.log('🔍 Testing SendGrid Configuration...\n')
  
  try {
    const result = await testSendGridConnection()
    
    if (result.success) {
      console.log('✅ SendGrid Configuration Test PASSED')
      console.log('📧 Message:', result.message)
      console.log('📋 Details:', result.details)
    } else {
      console.log('❌ SendGrid Configuration Test FAILED')
      console.log('🚨 Error:', result.error)
      console.log('📋 Details:', result.details)
      
      if (result.suggestions) {
        console.log('\n💡 Suggestions to fix:')
        result.suggestions.forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion}`)
        })
      }
    }
    
    console.log('\n🔧 Environment Variables Check:')
    console.log('   SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Not Set')
    console.log('   SENDGRID_SENDER_EMAIL:', process.env.SENDGRID_SENDER_EMAIL ? '✅ Set' : '❌ Not Set')
    
    if (process.env.SENDGRID_API_KEY) {
      console.log('   API Key Length:', process.env.SENDGRID_API_KEY.length, 'characters')
      console.log('   API Key Preview:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...')
    }
    
  } catch (error) {
    console.error('💥 Test script error:', error)
  }
}

// Run the test
testSendGrid() 